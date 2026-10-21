using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using Xunit;
using RigForge.Models;
using RigForge.Services;
using RigForge.ViewModels;

namespace RigForge.Tests;

public class HubTests
{
    private class FakeWingetService : IWingetService
    {
        public Task<string?> GetWingetVersionAsync() => Task.FromResult<string?>("v1.29.380");

        public Task<Dictionary<string, string>> ScanInstalledPackagesAsync(
            IEnumerable<SoftwarePackage> packages,
            Action<string, LogLevel>? logCallback = null,
            CancellationToken cancellationToken = default)
        {
            var map = new Dictionary<string, string>
            {
                { "Google.Chrome", "155.0.8059.86" },
                { "Mozilla.Firefox", "158.0" },
                { "Discord.Discord", "1.0.9262" },
                { "Telegram.TelegramDesktop", "7.3.1.0" },
                { "WhatsApp.WhatsApp", "2.2640.100.0" }
            };
            return Task.FromResult(map);
        }

        public Task<bool> InstallPackageAsync(string packageId, Action<string, LogLevel>? logCallback = null, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<bool> UpgradePackageAsync(string packageId, Action<string, LogLevel>? logCallback = null, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<bool> UpgradeAllPackagesAsync(Action<string, LogLevel>? logCallback = null, CancellationToken cancellationToken = default)
            => Task.FromResult(true);
    }

    [Fact]
    public void AppsJson_ContainsValidPackages()
    {
        string jsonPath = Path.Combine("..", "..", "..", "..", "RigForge", "Data", "apps.json");
        Assert.True(File.Exists(jsonPath), $"apps.json must exist at {jsonPath}");

        string json = File.ReadAllText(jsonPath);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var packages = JsonSerializer.Deserialize<List<SoftwarePackage>>(json, options);

        Assert.NotNull(packages);
        Assert.True(packages.Count >= 20, "Should have a comprehensive collection of apps");

        foreach (var p in packages)
        {
            Assert.False(string.IsNullOrWhiteSpace(p.Id), "Package ID must not be empty");
            Assert.False(string.IsNullOrWhiteSpace(p.Name), "Package Name must not be empty");
            Assert.False(string.IsNullOrWhiteSpace(p.Category), "Package Category must not be empty");
            Assert.False(string.IsNullOrWhiteSpace(p.Description), "Package Description must not be empty");
        }
    }

    [Fact]
    public void DetectionHelper_MatchesChromeFirefoxDiscordTelegramWhatsApp()
    {
        var testApps = new[]
        {
            new InstalledAppInfo("Google Chrome", @"ARP\Machine\X86\Google Chrome", "155.0.8059.86"),
            new InstalledAppInfo("Mozilla Firefox (x64 en-US)", @"ARP\Machine\X64\Mozilla Firefox", "158.0"),
            new InstalledAppInfo("Discord", @"ARP\User\X64\Discord", "1.0.9262"),
            new InstalledAppInfo("Telegram Desktop", @"MSIX\TelegramMessengerLLP.TelegramDesktop_7.3.1.0_x64__t4vj0pshhgkwm", "7.3.1.0"),
            new InstalledAppInfo("WhatsApp", @"MSIX\5319275A.WhatsAppDesktop_2.2640.100.0_x64__cv1g1gvanyjgm", "2.2640.100.0")
        };

        Assert.True(AppDetectionHelper.MatchesPackage("Google.Chrome", "Google Chrome", testApps[0]));
        Assert.True(AppDetectionHelper.MatchesPackage("Mozilla.Firefox", "Mozilla Firefox", testApps[1]));
        Assert.True(AppDetectionHelper.MatchesPackage("Discord.Discord", "Discord", testApps[2]));
        Assert.True(AppDetectionHelper.MatchesPackage("Telegram.TelegramDesktop", "Telegram Desktop", testApps[3]));
        Assert.True(AppDetectionHelper.MatchesPackage("WhatsApp.WhatsApp", "WhatsApp", testApps[4]));
    }

    [Fact]
    public void Presets_SelectCorrectPackages()
    {
        var fakeService = new FakeWingetService();
        var vm = new MainViewModel(fakeService);

        // Test Essentials preset
        vm.ApplyPresetCommand.Execute("essentials");
        Assert.True(vm.SelectedCount > 0);
        Assert.Contains(vm.AllPackages, p => p.Id == "Google.Chrome" && p.IsSelected);
        Assert.Contains(vm.AllPackages, p => p.Id == "7zip.7zip" && p.IsSelected);

        // Test Developer preset
        vm.ApplyPresetCommand.Execute("developer");
        Assert.Contains(vm.AllPackages, p => p.Id == "Microsoft.VisualStudioCode" && p.IsSelected);
        Assert.Contains(vm.AllPackages, p => p.Id == "Git.Git" && p.IsSelected);

        // Test Deselect All
        vm.DeselectAllCommand.Execute(null);
        Assert.Equal(0, vm.SelectedCount);
    }

    [Fact]
    public void SearchFiltering_FiltersCorrectly()
    {
        var fakeService = new FakeWingetService();
        var vm = new MainViewModel(fakeService);

        vm.SearchText = "Chrome";
        var filtered = vm.FilteredPackages.Cast<SoftwarePackage>().ToList();
        Assert.NotEmpty(filtered);
        Assert.All(filtered, p => Assert.Contains("Chrome", p.Name, StringComparison.OrdinalIgnoreCase));

        vm.SearchText = "";
        vm.SelectedCategory = "Browsers";
        var browserPackages = vm.FilteredPackages.Cast<SoftwarePackage>().ToList();
        Assert.NotEmpty(browserPackages);
        Assert.All(browserPackages, p => Assert.Equal("Browsers", p.Category, ignoreCase: true));
    }

    [Fact]
    public async Task ScanInstalled_UpdatesInstalledStatusForChromeDiscordWhatsApp()
    {
        var fakeService = new FakeWingetService();
        var vm = new MainViewModel(fakeService);

        await vm.ScanInstalledAsync();

        var chrome = vm.AllPackages.FirstOrDefault(p => p.Id == "Google.Chrome");
        Assert.NotNull(chrome);
        Assert.True(chrome.IsInstalled);
        Assert.Equal("155.0.8059.86", chrome.InstalledVersion);

        var discord = vm.AllPackages.FirstOrDefault(p => p.Id == "Discord.Discord");
        Assert.NotNull(discord);
        Assert.True(discord.IsInstalled);
        Assert.Equal("1.0.9262", discord.InstalledVersion);

        var whatsapp = vm.AllPackages.FirstOrDefault(p => p.Id == "WhatsApp.WhatsApp");
        Assert.NotNull(whatsapp);
        Assert.True(whatsapp.IsInstalled);
        Assert.Equal("2.2640.100.0", whatsapp.InstalledVersion);

        var telegram = vm.AllPackages.FirstOrDefault(p => p.Id == "Telegram.TelegramDesktop");
        Assert.NotNull(telegram);
        Assert.True(telegram.IsInstalled);
        Assert.Equal("7.3.1.0", telegram.InstalledVersion);
    }
}
