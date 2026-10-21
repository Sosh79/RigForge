using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;
using System.Windows.Input;
using RigForge.Models;
using RigForge.Services;
using Wpf.Ui.Appearance;

namespace RigForge.ViewModels;

public class MainViewModel : ObservableObject
{
    private readonly IWingetService _wingetService;
    private CancellationTokenSource? _cts;

    private string _searchText = string.Empty;
    private string _selectedCategory = "All";
    private bool _isBusy;
    private string _statusMessage = "Ready";
    private double _progressValue;
    private bool _isIndeterminate;
    private string _wingetVersion = "Checking...";
    private int _selectedCount;
    private int _installedCount;
    private bool _isDarkTheme = true;
    private bool _isLogVisible = false;

    public ObservableCollection<SoftwarePackage> AllPackages { get; } = new();
    public ICollectionView FilteredPackages { get; }
    public ObservableCollection<string> Categories { get; } = new();
    public ObservableCollection<InstallLogEntry> Logs { get; } = new();

    public string SearchText
    {
        get => _searchText;
        set
        {
            if (SetProperty(ref _searchText, value))
            {
                FilteredPackages.Refresh();
            }
        }
    }

    public string SelectedCategory
    {
        get => _selectedCategory;
        set
        {
            if (SetProperty(ref _selectedCategory, value))
            {
                FilteredPackages.Refresh();
            }
        }
    }

    public bool IsBusy
    {
        get => _isBusy;
        set
        {
            if (SetProperty(ref _isBusy, value))
            {
                (InstallSelectedCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
                (UpgradeAllCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
                (ScanInstalledCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
                (CancelCommand as RelayCommand)?.RaiseCanExecuteChanged();
            }
        }
    }

    public string StatusMessage
    {
        get => _statusMessage;
        set => SetProperty(ref _statusMessage, value);
    }

    public double ProgressValue
    {
        get => _progressValue;
        set => SetProperty(ref _progressValue, value);
    }

    public bool IsIndeterminate
    {
        get => _isIndeterminate;
        set => SetProperty(ref _isIndeterminate, value);
    }

    public string WingetVersion
    {
        get => _wingetVersion;
        set => SetProperty(ref _wingetVersion, value);
    }

    public int SelectedCount
    {
        get => _selectedCount;
        set => SetProperty(ref _selectedCount, value);
    }

    public int InstalledCount
    {
        get => _installedCount;
        set => SetProperty(ref _installedCount, value);
    }

    public bool IsDarkTheme
    {
        get => _isDarkTheme;
        set => SetProperty(ref _isDarkTheme, value);
    }

    public bool IsLogVisible
    {
        get => _isLogVisible;
        set => SetProperty(ref _isLogVisible, value);
    }

    public ICommand SelectAllCommand { get; }
    public ICommand DeselectAllCommand { get; }
    public ICommand SelectCategoryCommand { get; }
    public ICommand InstallSelectedCommand { get; }
    public ICommand UpgradeAllCommand { get; }
    public ICommand ScanInstalledCommand { get; }
    public ICommand InstallSingleCommand { get; }
    public ICommand CancelCommand { get; }
    public ICommand ClearLogsCommand { get; }
    public ICommand ToggleThemeCommand { get; }
    public ICommand ToggleLogsCommand { get; }
    public ICommand ApplyPresetCommand { get; }

    public MainViewModel(IWingetService wingetService)
    {
        _wingetService = wingetService;

        FilteredPackages = CollectionViewSource.GetDefaultView(AllPackages);
        FilteredPackages.Filter = FilterPackage;

        SelectAllCommand = new RelayCommand(SelectAll);
        DeselectAllCommand = new RelayCommand(DeselectAll);
        ApplyPresetCommand = new RelayCommand(param =>
        {
            if (param is string preset)
                ApplyPreset(preset);
        });
        SelectCategoryCommand = new RelayCommand(param =>
        {
            if (param is string cat)
                SelectedCategory = cat;
        });

        InstallSelectedCommand = new AsyncRelayCommand(InstallSelectedAsync, () => !IsBusy && SelectedCount > 0);
        UpgradeAllCommand = new AsyncRelayCommand(UpgradeAllAsync, () => !IsBusy);
        ScanInstalledCommand = new AsyncRelayCommand(ScanInstalledAsync, () => !IsBusy);
        InstallSingleCommand = new AsyncRelayCommand(async param =>
        {
            if (param is SoftwarePackage package)
                await InstallSinglePackageAsync(package);
        }, param => !IsBusy && param is SoftwarePackage);

        CancelCommand = new RelayCommand(CancelActiveOperation, () => IsBusy);
        ClearLogsCommand = new RelayCommand(() => Logs.Clear());
        ToggleThemeCommand = new RelayCommand(ToggleTheme);
        ToggleLogsCommand = new RelayCommand(() => IsLogVisible = !IsLogVisible);

        InitializeData();
    }

    private void InitializeData()
    {
        LoadApps();
        _ = CheckWingetAndScanAsync();
    }

    private void LoadApps()
    {
        try
        {
            string jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "apps.json");
            if (!File.Exists(jsonPath))
            {
                // Fallback to local dev path
                jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "apps.json");
            }

            if (File.Exists(jsonPath))
            {
                string json = File.ReadAllText(jsonPath);
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var packages = JsonSerializer.Deserialize<List<SoftwarePackage>>(json, options);

                if (packages != null)
                {
                    AllPackages.Clear();
                    Categories.Clear();
                    Categories.Add("All");

                    var cats = new HashSet<string>();

                    foreach (var pkg in packages)
                    {
                        pkg.PropertyChanged += (s, e) =>
                        {
                            if (e.PropertyName == nameof(SoftwarePackage.IsSelected))
                            {
                                UpdateSelectedCount();
                            }
                        };

                        AllPackages.Add(pkg);
                        if (!string.IsNullOrWhiteSpace(pkg.Category))
                        {
                            cats.Add(pkg.Category);
                        }
                    }

                    foreach (var c in cats.OrderBy(x => x))
                    {
                        Categories.Add(c);
                    }

                    SelectedCategory = "All";
                    StatusMessage = $"Ready. {AllPackages.Count} packages loaded.";
                    AddLog($"Loaded {AllPackages.Count} applications across {cats.Count} categories.", LogLevel.Info);
                }
            }
            else
            {
                AddLog($"Warning: Could not find apps.json at {jsonPath}", LogLevel.Warning);
            }
        }
        catch (Exception ex)
        {
            AddLog($"Failed to load apps.json: {ex.Message}", LogLevel.Error);
        }
    }

    private async Task CheckWingetAndScanAsync()
    {
        var version = await _wingetService.GetWingetVersionAsync();
        if (string.IsNullOrWhiteSpace(version))
        {
            WingetVersion = "Not Detected";
            AddLog("Windows Package Manager (winget) was not detected on this system. Please ensure winget is installed.", LogLevel.Error);
            StatusMessage = "Winget not found. Please install Windows Package Manager.";
        }
        else
        {
            WingetVersion = $"Winget {version}";
            AddLog($"Detected Windows Package Manager: {WingetVersion}", LogLevel.Success);
            await ScanInstalledAsync();
        }
    }

    public async Task ScanInstalledAsync()
    {
        if (IsBusy) return;

        IsBusy = true;
        IsIndeterminate = true;
        StatusMessage = "Scanning for installed packages...";
        _cts = new CancellationTokenSource();

        try
        {
            var installedMap = await _wingetService.ScanInstalledPackagesAsync(AllPackages, (msg, level) => AddLog(msg, level), _cts.Token);

            int installed = 0;
            foreach (var pkg in AllPackages)
            {
                if (installedMap.TryGetValue(pkg.Id, out var ver))
                {
                    pkg.IsInstalled = true;
                    pkg.InstalledVersion = ver;
                    pkg.Status = PackageStatus.Installed;
                    pkg.StatusMessage = string.IsNullOrWhiteSpace(ver) ? "Installed" : $"v{ver}";
                    installed++;
                }
            }

            InstalledCount = installed;
            StatusMessage = $"Scan complete. {installed} of {AllPackages.Count} apps currently installed.";
        }
        catch (OperationCanceledException)
        {
            AddLog("Scan operation cancelled.", LogLevel.Warning);
            StatusMessage = "Scan cancelled.";
        }
        catch (Exception ex)
        {
            AddLog($"Scan error: {ex.Message}", LogLevel.Error);
            StatusMessage = "Scan failed.";
        }
        finally
        {
            IsIndeterminate = false;
            IsBusy = false;
        }
    }

    public async Task InstallSelectedAsync()
    {
        var selectedList = AllPackages.Where(p => p.IsSelected).ToList();
        if (selectedList.Count == 0 || IsBusy) return;

        IsBusy = true;
        IsLogVisible = true;
        _cts = new CancellationTokenSource();
        int total = selectedList.Count;
        int current = 0;
        int succeeded = 0;
        int failed = 0;

        ProgressValue = 0;
        IsIndeterminate = false;

        AddLog($"Starting bulk installation of {total} selected application(s)...", LogLevel.Info);

        // Mark all as queued
        foreach (var pkg in selectedList)
        {
            pkg.Status = PackageStatus.Queued;
            pkg.StatusMessage = "Queued...";
        }

        try
        {
            for (int i = 0; i < selectedList.Count; i++)
            {
                if (_cts.IsCancellationRequested) break;

                var pkg = selectedList[i];
                current = i + 1;
                StatusMessage = $"Installing {pkg.Name} ({current}/{total})...";
                pkg.Status = PackageStatus.Installing;
                pkg.StatusMessage = "Installing...";

                AddLog($"[{current}/{total}] Preparing installation: {pkg.Name} ({pkg.Id})", LogLevel.Info);

                bool success = await _wingetService.InstallPackageAsync(pkg.Id, (msg, level) => AddLog(msg, level), _cts.Token);

                if (success)
                {
                    pkg.Status = PackageStatus.Success;
                    pkg.StatusMessage = "Installed";
                    pkg.IsInstalled = true;
                    succeeded++;
                }
                else
                {
                    pkg.Status = PackageStatus.Failed;
                    pkg.StatusMessage = "Failed";
                    failed++;
                }

                ProgressValue = ((double)current / total) * 100.0;
            }

            if (_cts.IsCancellationRequested)
            {
                AddLog("Bulk installation cancelled by user.", LogLevel.Warning);
                StatusMessage = $"Installation cancelled. {succeeded} installed, {failed} failed.";
            }
            else
            {
                AddLog($"Bulk installation completed: {succeeded} succeeded, {failed} failed.", LogLevel.Success);
                StatusMessage = $"Finished: {succeeded} of {total} apps installed successfully.";
            }
        }
        catch (OperationCanceledException)
        {
            AddLog("Bulk installation process cancelled.", LogLevel.Warning);
            StatusMessage = "Installation cancelled.";
        }
        catch (Exception ex)
        {
            AddLog($"Bulk install error: {ex.Message}", LogLevel.Error);
            StatusMessage = "Installation encountered an error.";
        }
        finally
        {
            IsBusy = false;
            UpdateInstalledCount();
        }
    }

    public async Task InstallSinglePackageAsync(SoftwarePackage package)
    {
        if (IsBusy || package == null) return;

        IsBusy = true;
        IsLogVisible = true;
        _cts = new CancellationTokenSource();
        package.Status = PackageStatus.Installing;
        package.StatusMessage = "Installing...";
        StatusMessage = $"Installing {package.Name}...";
        IsIndeterminate = true;

        AddLog($"Starting individual installation of {package.Name} ({package.Id})...", LogLevel.Info);

        try
        {
            bool success = await _wingetService.InstallPackageAsync(package.Id, (msg, level) => AddLog(msg, level), _cts.Token);
            if (success)
            {
                package.Status = PackageStatus.Success;
                package.StatusMessage = "Installed";
                package.IsInstalled = true;
                StatusMessage = $"{package.Name} installed successfully!";
            }
            else
            {
                package.Status = PackageStatus.Failed;
                package.StatusMessage = "Failed";
                StatusMessage = $"Failed to install {package.Name}.";
            }
        }
        catch (OperationCanceledException)
        {
            package.Status = PackageStatus.Idle;
            package.StatusMessage = "Cancelled";
            AddLog($"Installation of {package.Name} cancelled.", LogLevel.Warning);
        }
        catch (Exception ex)
        {
            package.Status = PackageStatus.Failed;
            package.StatusMessage = "Error";
            AddLog($"Error installing {package.Name}: {ex.Message}", LogLevel.Error);
        }
        finally
        {
            IsIndeterminate = false;
            IsBusy = false;
            UpdateInstalledCount();
        }
    }

    public async Task UpgradeAllAsync()
    {
        if (IsBusy) return;

        IsBusy = true;
        IsIndeterminate = true;
        IsLogVisible = true;
        _cts = new CancellationTokenSource();
        StatusMessage = "Upgrading all installed system applications...";

        AddLog("Initiating bulk upgrade for all installed Windows applications...", LogLevel.Info);

        try
        {
            bool success = await _wingetService.UpgradeAllPackagesAsync((msg, level) => AddLog(msg, level), _cts.Token);
            if (success)
            {
                StatusMessage = "System upgrade completed successfully.";
            }
            else
            {
                StatusMessage = "System upgrade completed with notes (check log).";
            }
        }
        catch (OperationCanceledException)
        {
            AddLog("Bulk upgrade operation cancelled by user.", LogLevel.Warning);
            StatusMessage = "Upgrade cancelled.";
        }
        catch (Exception ex)
        {
            AddLog($"Bulk upgrade error: {ex.Message}", LogLevel.Error);
            StatusMessage = "Upgrade failed.";
        }
        finally
        {
            IsIndeterminate = false;
            IsBusy = false;
            _ = ScanInstalledAsync();
        }
    }

    private void CancelActiveOperation()
    {
        if (_cts != null && !_cts.IsCancellationRequested)
        {
            AddLog("Cancelling current operation requested by user...", LogLevel.Warning);
            _cts.Cancel();
        }
    }

    private void SelectAll()
    {
        foreach (var item in FilteredPackages.Cast<SoftwarePackage>())
        {
            item.IsSelected = true;
        }
        UpdateSelectedCount();
    }

    private void DeselectAll()
    {
        foreach (var item in AllPackages)
        {
            item.IsSelected = false;
        }
        UpdateSelectedCount();
    }

    private void ApplyPreset(string presetName)
    {
        DeselectAll();
        var ids = presetName.ToLowerInvariant() switch
        {
            "essentials" => new[] { "Google.Chrome", "7zip.7zip", "VideoLAN.VLC", "Discord.Discord", "RARLab.WinRAR" },
            "developer" => new[] { "Microsoft.VisualStudioCode", "Git.Git", "Microsoft.WindowsTerminal", "OpenJS.NodeJS.LTS", "Python.Python.3.12", "Docker.DockerDesktop", "voidtools.Everything", "7zip.7zip" },
            "gaming" => new[] { "Valve.Steam", "EpicGames.EpicGamesLauncher", "Discord.Discord", "Microsoft.VCRedist.2015+.x64", "Microsoft.DirectX", "Opera.OperaGX" },
            "creator" => new[] { "OBSProject.OBSStudio", "BlenderFoundation.Blender", "GIMP.GIMP", "Audacity.Audacity", "HandBrake.HandBrake", "ShareX.ShareX" },
            _ => Array.Empty<string>()
        };

        SelectPackages(ids);
        AddLog($"Applied '{presetName}' preset ({SelectedCount} apps selected).", LogLevel.Info);
    }

    private void SelectPackages(IEnumerable<string> packageIds)
    {
        var idSet = new HashSet<string>(packageIds, StringComparer.OrdinalIgnoreCase);
        foreach (var p in AllPackages)
        {
            if (idSet.Contains(p.Id))
            {
                p.IsSelected = true;
            }
        }
        UpdateSelectedCount();
    }

    private void UpdateSelectedCount()
    {
        SelectedCount = AllPackages.Count(p => p.IsSelected);
        (InstallSelectedCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
    }

    private void UpdateInstalledCount()
    {
        InstalledCount = AllPackages.Count(p => p.IsInstalled);
    }

    private void ToggleTheme()
    {
        IsDarkTheme = !IsDarkTheme;
        ThemeService.ApplyTheme(IsDarkTheme);
        AddLog($"Switched theme to {(IsDarkTheme ? "Dark" : "Light")}.", LogLevel.Info);
    }

    public void AddLog(string message, LogLevel level = LogLevel.Info)
    {
        if (string.IsNullOrWhiteSpace(message)) return;

        Application.Current?.Dispatcher?.InvokeAsync(() =>
        {
            var entry = new InstallLogEntry { Message = message, Level = level };
            Logs.Add(entry);

            // Limit logs size to prevent unbounded memory growth
            while (Logs.Count > 1000)
            {
                Logs.RemoveAt(0);
            }
        });
    }

    private bool FilterPackage(object obj)
    {
        if (obj is not SoftwarePackage package)
            return false;

        // Category filter
        if (!string.IsNullOrWhiteSpace(SelectedCategory) && SelectedCategory != "All")
        {
            if (!string.Equals(package.Category, SelectedCategory, StringComparison.OrdinalIgnoreCase))
                return false;
        }

        // Search text filter
        if (!string.IsNullOrWhiteSpace(SearchText))
        {
            var query = SearchText.Trim();
            bool matches = package.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                            package.Description.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                            package.Category.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                            package.Id.Contains(query, StringComparison.OrdinalIgnoreCase);

            if (!matches) return false;
        }

        return true;
    }
}
