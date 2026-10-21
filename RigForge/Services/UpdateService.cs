using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using RigForge.Models;

namespace RigForge.Services;

public class UpdateService : IUpdateService
{
    private const string GitHubOwner = "Sosh79";
    private const string GitHubRepo = "RigForge";
    private static readonly HttpClient HttpClient = new()
    {
        Timeout = TimeSpan.FromSeconds(30)
    };

    public string CurrentVersion
    {
        get
        {
            var version = Assembly.GetExecutingAssembly().GetName().Version;
            return version != null ? $"{version.Major}.{version.Minor}.{version.Build}" : "1.0.0";
        }
    }

    public async Task<UpdateInfo?> CheckForUpdatesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            string url = $"https://api.github.com/repos/{GitHubOwner}/{GitHubRepo}/releases/latest";
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("User-Agent", "RigForge-AutoUpdater");
            request.Headers.Add("Accept", "application/vnd.github.v3+json");

            using var response = await HttpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            string json = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (!root.TryGetProperty("tag_name", out var tagProp)) return null;

            string tagName = tagProp.GetString() ?? string.Empty;
            string cleanLatestVersion = tagName.TrimStart('v', 'V').Trim();

            if (!IsNewerVersion(cleanLatestVersion, CurrentVersion))
            {
                return new UpdateInfo
                {
                    IsUpdateAvailable = false,
                    CurrentVersion = CurrentVersion,
                    LatestVersion = cleanLatestVersion
                };
            }

            string title = root.TryGetProperty("name", out var nameProp) ? nameProp.GetString() ?? tagName : tagName;
            string notes = root.TryGetProperty("body", out var bodyProp) ? bodyProp.GetString() ?? string.Empty : string.Empty;
            string htmlUrl = root.TryGetProperty("html_url", out var htmlProp) ? htmlProp.GetString() ?? string.Empty : string.Empty;

            string downloadUrl = string.Empty;
            long fileSize = 0;

            if (root.TryGetProperty("assets", out var assetsProp) && assetsProp.ValueKind == JsonValueKind.Array)
            {
                foreach (var asset in assetsProp.EnumerateArray())
                {
                    string assetName = asset.TryGetProperty("name", out var an) ? an.GetString() ?? "" : "";
                    if (assetName.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                    {
                        downloadUrl = asset.TryGetProperty("browser_download_url", out var bdu) ? bdu.GetString() ?? "" : "";
                        fileSize = asset.TryGetProperty("size", out var sz) ? sz.GetInt64() : 0;
                        if (assetName.Equals("RigForge.exe", StringComparison.OrdinalIgnoreCase))
                        {
                            break;
                        }
                    }
                }
            }

            if (string.IsNullOrWhiteSpace(downloadUrl))
            {
                return null;
            }

            return new UpdateInfo
            {
                IsUpdateAvailable = true,
                CurrentVersion = CurrentVersion,
                LatestVersion = cleanLatestVersion,
                ReleaseTitle = title,
                ReleaseNotes = notes,
                DownloadUrl = downloadUrl,
                FileSizeBytes = fileSize,
                HtmlUrl = htmlUrl
            };
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> DownloadAndApplyUpdateAsync(
        string downloadUrl,
        IProgress<double>? progress = null,
        Action<string>? statusCallback = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            string tempDir = Path.Combine(Path.GetTempPath(), "RigForge_Update");
            Directory.CreateDirectory(tempDir);

            string tempExePath = Path.Combine(tempDir, "RigForge_New.exe");
            statusCallback?.Invoke("Connecting to download server...");

            using (var request = new HttpRequestMessage(HttpMethod.Get, downloadUrl))
            {
                request.Headers.Add("User-Agent", "RigForge-AutoUpdater");
                using var response = await HttpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
                response.EnsureSuccessStatusCode();

                long? totalBytes = response.Content.Headers.ContentLength;
                using var contentStream = await response.Content.ReadAsStreamAsync(cancellationToken);
                using var fileStream = new FileStream(tempExePath, FileMode.Create, FileAccess.Write, FileShare.None, 81920, true);

                var buffer = new byte[81920];
                long totalRead = 0;
                int bytesRead;

                while ((bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken)) > 0)
                {
                    await fileStream.WriteAsync(buffer, 0, bytesRead, cancellationToken);
                    totalRead += bytesRead;

                    if (totalBytes.HasValue && totalBytes.Value > 0)
                    {
                        double pct = ((double)totalRead / totalBytes.Value) * 100.0;
                        progress?.Report(pct);
                        statusCallback?.Invoke($"Downloading update: {pct:F0}% ({totalRead / 1024 / 1024:F1}MB / {totalBytes.Value / 1024 / 1024:F1}MB)");
                    }
                    else
                    {
                        statusCallback?.Invoke($"Downloading update: {totalRead / 1024 / 1024:F1}MB");
                    }
                }
            }

            statusCallback?.Invoke("Preparing to install and restart application...");

            string? currentExePath = Environment.ProcessPath;
            if (string.IsNullOrWhiteSpace(currentExePath) || !File.Exists(currentExePath))
            {
                currentExePath = Process.GetCurrentProcess().MainModule?.FileName;
            }

            if (string.IsNullOrWhiteSpace(currentExePath) || !File.Exists(currentExePath))
            {
                throw new InvalidOperationException("Could not determine current executable path.");
            }

            int currentPid = Process.GetCurrentProcess().Id;
            string scriptPath = Path.Combine(tempDir, "apply_update.bat");

            string batchContent = $@"@echo off
setlocal enabledelayedexpansion
title Updating RigForge...

set ""TARGET={currentExePath}""
set ""NEW_FILE={tempExePath}""
set ""PID={currentPid}""

:: Wait for parent process to exit
:WAIT_LOOP
timeout /t 1 /nobreak >nul
tasklist /fi ""PID eq !PID!"" 2>nul | findstr /i ""!PID!"" >nul
if not errorlevel 1 goto WAIT_LOOP

:: Overwrite target executable
copy /y ""!NEW_FILE!"" ""!TARGET!"" >nul
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    copy /y ""!NEW_FILE!"" ""!TARGET!"" >nul
)

:: Restart updated application
start """" ""!TARGET!""

:: Exit
exit
";

            await File.WriteAllTextAsync(scriptPath, batchContent, cancellationToken);

            // Launch updater script detached
            var psi = new ProcessStartInfo
            {
                FileName = scriptPath,
                UseShellExecute = true,
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden
            };
            Process.Start(psi);

            // Shutdown current application safely
            Application.Current.Dispatcher.Invoke(() =>
            {
                Application.Current.Shutdown();
            });

            return true;
        }
        catch (Exception ex)
        {
            statusCallback?.Invoke($"Update error: {ex.Message}");
            return false;
        }
    }

    private static bool IsNewerVersion(string latestStr, string currentStr)
    {
        if (Version.TryParse(latestStr, out var latestVer) && Version.TryParse(currentStr, out var currentVer))
        {
            return latestVer > currentVer;
        }
        return string.Compare(latestStr, currentStr, StringComparison.OrdinalIgnoreCase) > 0;
    }
}
