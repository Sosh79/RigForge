using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using RigForge.Models;

namespace RigForge.Services;

public class WingetService : IWingetService
{
    private const int APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE = unchecked((int)0x8A15002B);
    private const int APPINSTALLER_CLI_ERROR_NO_APPLICATIONS_FOUND = unchecked((int)0x8A150014);

    public async Task<string?> GetWingetVersionAsync()
    {
        try
        {
            var result = await RunProcessAsync("winget", "--version", null, CancellationToken.None);
            if (result.ExitCode == 0 && !string.IsNullOrWhiteSpace(result.Output))
            {
                return result.Output.Trim();
            }
        }
        catch
        {
            // Winget not found
        }
        return null;
    }

    public async Task<Dictionary<string, string>> ScanInstalledPackagesAsync(
        IEnumerable<SoftwarePackage> packages,
        Action<string, LogLevel>? logCallback = null,
        CancellationToken cancellationToken = default)
    {
        var installedMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        logCallback?.Invoke("Scanning system for installed software packages (Registry + Winget + MSIX)...", LogLevel.Info);

        var allInstalledItems = new List<InstalledAppInfo>();

        // Step 1: Instant Windows Registry scan
        try
        {
            var registryApps = AppDetectionHelper.ScanWindowsRegistry();
            allInstalledItems.AddRange(registryApps);
            logCallback?.Invoke($"Registry scan found {registryApps.Count} registered software titles.", LogLevel.Info);
        }
        catch (Exception ex)
        {
            logCallback?.Invoke($"Registry scan note: {ex.Message}", LogLevel.Warning);
        }

        // Step 2: Winget list scan (includes MSIX/Store and Winget sources)
        try
        {
            var result = await RunProcessAsync("winget", "list", null, cancellationToken);
            if (!string.IsNullOrWhiteSpace(result.Output))
            {
                var wingetApps = AppDetectionHelper.ParseWingetListOutput(result.Output);
                allInstalledItems.AddRange(wingetApps);
                logCallback?.Invoke($"Winget scan found {wingetApps.Count} active installed entries.", LogLevel.Info);
            }
        }
        catch (OperationCanceledException)
        {
            logCallback?.Invoke("Scan cancelled by user.", LogLevel.Warning);
            return installedMap;
        }
        catch (Exception ex)
        {
            logCallback?.Invoke($"Winget list scan warning: {ex.Message}", LogLevel.Warning);
        }

        // Step 3: Match against target SoftwarePackages
        var packageList = packages.ToList();
        foreach (var pkg in packageList)
        {
            if (installedMap.ContainsKey(pkg.Id))
                continue;

            foreach (var item in allInstalledItems)
            {
                if (AppDetectionHelper.MatchesPackage(pkg.Id, pkg.Name, item))
                {
                    installedMap[pkg.Id] = item.Version;
                    break;
                }
            }
        }

        logCallback?.Invoke($"Detection complete. Successfully identified {installedMap.Count} installed applications on this system.", LogLevel.Success);
        return installedMap;
    }

    public async Task<bool> InstallPackageAsync(
        string packageId,
        Action<string, LogLevel>? logCallback = null,
        CancellationToken cancellationToken = default)
    {
        string arguments = $"install --id \"{packageId}\" --silent --accept-package-agreements --accept-source-agreements --force --disable-interactivity";
        logCallback?.Invoke($"Running: winget {arguments}", LogLevel.Info);

        var result = await RunProcessAsync("winget", arguments, logCallback, cancellationToken);

        if (result.ExitCode == 0)
        {
            logCallback?.Invoke($"Successfully installed: {packageId}", LogLevel.Success);
            return true;
        }
        else if (result.ExitCode == APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE)
        {
            logCallback?.Invoke($"{packageId} is already installed and up to date.", LogLevel.Success);
            return true;
        }
        else
        {
            logCallback?.Invoke($"Installation failed for {packageId} (Exit Code: {result.ExitCode}).", LogLevel.Error);
            return false;
        }
    }

    public async Task<bool> UpgradePackageAsync(
        string packageId,
        Action<string, LogLevel>? logCallback = null,
        CancellationToken cancellationToken = default)
    {
        string arguments = $"upgrade --id \"{packageId}\" --silent --accept-package-agreements --accept-source-agreements --disable-interactivity";
        logCallback?.Invoke($"Running: winget {arguments}", LogLevel.Info);

        var result = await RunProcessAsync("winget", arguments, logCallback, cancellationToken);

        if (result.ExitCode == 0 || result.ExitCode == APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE)
        {
            logCallback?.Invoke($"Package {packageId} is now at latest version.", LogLevel.Success);
            return true;
        }
        else
        {
            logCallback?.Invoke($"Upgrade failed for {packageId} (Exit Code: {result.ExitCode}).", LogLevel.Error);
            return false;
        }
    }

    public async Task<bool> UpgradeAllPackagesAsync(
        Action<string, LogLevel>? logCallback = null,
        CancellationToken cancellationToken = default)
    {
        string arguments = "upgrade --all --silent --accept-package-agreements --accept-source-agreements --disable-interactivity";
        logCallback?.Invoke($"Executing bulk system upgrade: winget {arguments}", LogLevel.Info);

        var result = await RunProcessAsync("winget", arguments, logCallback, cancellationToken);

        if (result.ExitCode == 0 || result.ExitCode == APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE)
        {
            logCallback?.Invoke("All installed system packages are up to date!", LogLevel.Success);
            return true;
        }
        else
        {
            logCallback?.Invoke($"Bulk upgrade completed with warnings or exit code: {result.ExitCode}", LogLevel.Warning);
            return false;
        }
    }

    private async Task<(int ExitCode, string Output)> RunProcessAsync(
        string fileName,
        string arguments,
        Action<string, LogLevel>? logCallback,
        CancellationToken cancellationToken)
    {
        var outputBuilder = new StringBuilder();

        var psi = new ProcessStartInfo
        {
            FileName = fileName,
            Arguments = arguments,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8
        };

        using var process = new Process { StartInfo = psi, EnableRaisingEvents = true };

        var tcs = new TaskCompletionSource<int>(TaskCreationOptions.RunContinuationsAsynchronously);

        process.OutputDataReceived += (s, e) =>
        {
            if (e.Data != null)
            {
                outputBuilder.AppendLine(e.Data);
                logCallback?.Invoke(e.Data, ClassifyOutput(e.Data));
            }
        };

        process.ErrorDataReceived += (s, e) =>
        {
            if (e.Data != null)
            {
                outputBuilder.AppendLine(e.Data);
                logCallback?.Invoke(e.Data, LogLevel.Warning);
            }
        };

        process.Exited += (s, e) =>
        {
            tcs.TrySetResult(process.ExitCode);
        };

        try
        {
            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
        }
        catch (Exception ex)
        {
            logCallback?.Invoke($"Failed to launch {fileName}: {ex.Message}", LogLevel.Error);
            throw;
        }

        using (cancellationToken.Register(() =>
        {
            try
            {
                if (!process.HasExited)
                {
                    process.Kill(true);
                }
            }
            catch
            {
                // Process may have already exited
            }
            tcs.TrySetCanceled(cancellationToken);
        }))
        {
            int exitCode = await tcs.Task;
            return (exitCode, outputBuilder.ToString());
        }
    }

    private static LogLevel ClassifyOutput(string line)
    {
        if (string.IsNullOrWhiteSpace(line))
            return LogLevel.Winget;

        var lower = line.ToLowerInvariant();
        if (lower.Contains("successfully") || lower.Contains("success") || lower.Contains("completed"))
            return LogLevel.Success;
        if (lower.Contains("error") || lower.Contains("failed") || lower.Contains("fail"))
            return LogLevel.Error;
        if (lower.Contains("warning") || lower.Contains("warn"))
            return LogLevel.Warning;

        return LogLevel.Winget;
    }
}
