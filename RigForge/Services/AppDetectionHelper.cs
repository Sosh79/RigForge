using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.Win32;

namespace RigForge.Services;

public record InstalledAppInfo(string Name, string Id, string Version);

public static class AppDetectionHelper
{
    private static readonly Regex MultiSpaceRegex = new(@"\s{2,}", RegexOptions.Compiled);

    public static List<InstalledAppInfo> ParseWingetListOutput(string output)
    {
        var result = new List<InstalledAppInfo>();
        if (string.IsNullOrWhiteSpace(output))
            return result;

        var lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

        foreach (var line in lines)
        {
            if (string.IsNullOrWhiteSpace(line))
                continue;

            // Skip header and separator lines
            if (line.StartsWith("Name", StringComparison.OrdinalIgnoreCase) ||
                line.StartsWith("----", StringComparison.OrdinalIgnoreCase) ||
                line.Contains("<options>", StringComparison.OrdinalIgnoreCase))
                continue;

            var cols = MultiSpaceRegex.Split(line.Trim());
            if (cols.Length >= 2)
            {
                string name = cols[0].Trim();
                string id = cols[1].Trim();
                string version = cols.Length >= 3 ? cols[2].Trim() : string.Empty;

                result.Add(new InstalledAppInfo(name, id, version));
            }
        }

        return result;
    }

    public static List<InstalledAppInfo> ScanWindowsRegistry()
    {
        var result = new List<InstalledAppInfo>();

        var registryKeys = new[]
        {
            (Registry.LocalMachine, @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
            (Registry.LocalMachine, @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"),
            (Registry.CurrentUser, @"Software\Microsoft\Windows\CurrentVersion\Uninstall")
        };

        foreach (var (root, subKeyPath) in registryKeys)
        {
            try
            {
                using var baseKey = root.OpenSubKey(subKeyPath);
                if (baseKey == null) continue;

                foreach (var subKeyName in baseKey.GetSubKeyNames())
                {
                    try
                    {
                        using var appKey = baseKey.OpenSubKey(subKeyName);
                        if (appKey == null) continue;

                        var displayName = appKey.GetValue("DisplayName")?.ToString()?.Trim();
                        if (string.IsNullOrWhiteSpace(displayName)) continue;

                        var displayVersion = appKey.GetValue("DisplayVersion")?.ToString()?.Trim() ?? string.Empty;
                        result.Add(new InstalledAppInfo(displayName, subKeyName, displayVersion));
                    }
                    catch
                    {
                        // Ignore individual subkey read errors
                    }
                }
            }
            catch
            {
                // Ignore base key errors
            }
        }

        return result;
    }

    public static bool MatchesPackage(string pkgId, string pkgName, InstalledAppInfo installed)
    {
        // 1. Direct ID match
        if (string.Equals(installed.Id, pkgId, StringComparison.OrdinalIgnoreCase))
            return true;

        if (installed.Id.IndexOf(pkgId, StringComparison.OrdinalIgnoreCase) >= 0)
            return true;

        // 2. Exact Name match (case-insensitive)
        if (string.Equals(installed.Name, pkgName, StringComparison.OrdinalIgnoreCase))
            return true;

        // 3. Name starts with Package Name (e.g. "Mozilla Firefox (x64 en-US)" starts with "Mozilla Firefox")
        if (installed.Name.StartsWith(pkgName, StringComparison.OrdinalIgnoreCase))
            return true;

        // 4. Installed ID ends with or contains Package Name (e.g. "ARP\Machine\X86\Google Chrome")
        if (installed.Id.EndsWith(pkgName, StringComparison.OrdinalIgnoreCase) ||
            installed.Id.IndexOf(pkgName, StringComparison.OrdinalIgnoreCase) >= 0)
            return true;

        // 5. Special aliases
        string normPkgId = pkgId.ToLowerInvariant();
        string normInstalledName = installed.Name.ToLowerInvariant();
        string normInstalledId = installed.Id.ToLowerInvariant();

        if (normPkgId == "discord.discord" && normInstalledName == "discord")
            return true;

        if (normPkgId == "google.chrome" && normInstalledName.Contains("google chrome"))
            return true;

        if (normPkgId == "mozilla.firefox" && normInstalledName.Contains("firefox"))
            return true;

        if (normPkgId == "telegram.telegramdesktop" && (normInstalledName.Contains("telegram") || normInstalledId.Contains("telegramdesktop")))
            return true;

        if (normPkgId == "whatsapp.whatsapp" && (normInstalledName.Contains("whatsapp") || normInstalledId.Contains("whatsappdesktop")))
            return true;

        if (normPkgId == "git.git" && (normInstalledName == "git" || normInstalledName.StartsWith("git for windows")))
            return true;

        if (normPkgId == "microsoft.visualstudiocode" && (normInstalledName.Contains("visual studio code") || normInstalledName.Contains("vscode")))
            return true;

        if (normPkgId == "rarlab.winrar" && normInstalledName.StartsWith("winrar"))
            return true;

        if (normPkgId == "7zip.7zip" && (normInstalledName.StartsWith("7-zip") || normInstalledId.Contains("7-zip")))
            return true;

        if (normPkgId == "videolan.vlc" && normInstalledName.Contains("vlc media player"))
            return true;

        if (normPkgId == "valve.steam" && (normInstalledName == "steam" || normInstalledId.EndsWith(@"\steam")))
            return true;

        if (normPkgId.StartsWith("python.python") && normInstalledName.StartsWith("python 3."))
            return true;

        if (normPkgId == "docker.dockerdesktop" && normInstalledName.Contains("docker desktop"))
            return true;

        if (normPkgId == "voidtools.everything" && normInstalledName.StartsWith("everything"))
            return true;

        if (normPkgId == "bytedance.capcut" && (normInstalledName.Contains("capcut") || normInstalledId.Contains("capcut")))
            return true;

        if (normPkgId == "google.antigravity" && (normInstalledName.StartsWith("antigravity") && !normInstalledName.Contains("ide")))
            return true;

        if (normPkgId == "google.antigravityide" && normInstalledName.Contains("antigravity ide"))
            return true;

        if ((normPkgId == "wisprflow.wisprflow" || normPkgId == "9pnt7hr375bw") && (normInstalledName.Contains("wispr flow") || normInstalledName.Contains("wisprflow") || normInstalledId.Contains("wisprflow")))
            return true;

        if (normPkgId == "sst.opencodedesktop" && (normInstalledName.Contains("opencode") || normInstalledId.Contains("opencode")))
            return true;

        if (normPkgId == "zhipuai.zcode" && (normInstalledName.Contains("zcode") || normInstalledId.Contains("zcode")))
            return true;

        if (normPkgId == "anthropic.claude" && (normInstalledName.Contains("claude") || normInstalledId.Contains("claude")))
            return true;

        if ((normPkgId == "9plm9xgg6vks" || normPkgId == "openai.chatgpt") && (normInstalledName.Contains("chatgpt") || normInstalledId.Contains("chatgpt")))
            return true;

        if (normPkgId == "openai.codex" && (normInstalledName.Contains("codex") || normInstalledId.Contains("codex")))
            return true;

        if (normPkgId == "ubisoft.connect" && (normInstalledName.Contains("ubisoft connect") || normInstalledName.Contains("uplay") || normInstalledId.Contains("uplay")))
            return true;

        if (normPkgId == "electronicarts.eadesktop" && (normInstalledName.Contains("ea app") || normInstalledName.Contains("ea desktop") || normInstalledId.Contains("eadesktop")))
            return true;

        if (normPkgId.StartsWith("openjs.nodejs") && (normInstalledName.StartsWith("node.js") || normInstalledName.Contains("nodejs") || normInstalledId.Contains("nodejs")))
            return true;

        if (normPkgId == "mongodb.compass.full" && (normInstalledName.Contains("mongodb compass") || normInstalledId.Contains("mongodbcompass") || normInstalledId.Contains("mongodb.compass")))
            return true;

        if (normPkgId == "oracle.mysql" && (normInstalledName.StartsWith("mysql server") || normInstalledName.Contains("mysql server") || normInstalledId.Contains("mysql")))
            return true;

        return false;
    }
}
