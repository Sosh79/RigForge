using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace RigForge.Models;

public class SoftwarePackage : INotifyPropertyChanged
{
    private bool _isSelected;
    private PackageStatus _status = PackageStatus.Idle;
    private string _statusMessage = "Ready";
    private bool _isInstalled;
    private string _installedVersion = string.Empty;
    private double _progress;
    private ImageSource? _cachedIcon;
    private bool _iconLoadAttempted;

    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "Apps24";

    public bool IsSelected
    {
        get => _isSelected;
        set => SetField(ref _isSelected, value);
    }

    [JsonIgnore]
    public PackageStatus Status
    {
        get => _status;
        set
        {
            if (SetField(ref _status, value))
            {
                OnPropertyChanged(nameof(IsOperationActive));
            }
        }
    }

    [JsonIgnore]
    public string StatusMessage
    {
        get => _statusMessage;
        set => SetField(ref _statusMessage, value);
    }

    [JsonIgnore]
    public bool IsInstalled
    {
        get => _isInstalled;
        set
        {
            if (SetField(ref _isInstalled, value))
            {
                if (value && Status == PackageStatus.Idle)
                {
                    Status = PackageStatus.Installed;
                    StatusMessage = string.IsNullOrWhiteSpace(InstalledVersion) ? "Installed" : $"v{InstalledVersion}";
                }
            }
        }
    }

    [JsonIgnore]
    public string InstalledVersion
    {
        get => _installedVersion;
        set => SetField(ref _installedVersion, value);
    }

    [JsonIgnore]
    public double Progress
    {
        get => _progress;
        set => SetField(ref _progress, value);
    }

    [JsonIgnore]
    public ImageSource? IconImage
    {
        get
        {
            if (!_iconLoadAttempted)
            {
                _iconLoadAttempted = true;
                _cachedIcon = LoadIcon();
            }
            return _cachedIcon;
        }
    }

    [JsonIgnore]
    public string IconPath
    {
        get
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            var candidates = new List<string> { Id };
            if (Id.Equals("9PLM9XGG6VKS", StringComparison.OrdinalIgnoreCase))
                candidates.Add("OpenAI.ChatGPT");

            foreach (var name in candidates)
            {
                string path = Path.Combine(baseDir, "Assets", "Icons", $"{name}.png");
                if (File.Exists(path)) return path;

                path = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "Icons", $"{name}.png");
                if (File.Exists(path)) return path;

                path = Path.Combine(Directory.GetCurrentDirectory(), "RigForge", "Assets", "Icons", $"{name}.png");
                if (File.Exists(path)) return path;
            }

            return $"pack://application:,,,/Assets/Icons/{Id}.png";
        }
    }

    [JsonIgnore]
    public bool HasIcon => IconImage != null || !string.IsNullOrEmpty(IconPath);

    private ImageSource? LoadIcon()
    {
        var candidates = new List<string> { Id };
        if (Id.Equals("9PLM9XGG6VKS", StringComparison.OrdinalIgnoreCase))
        {
            candidates.Add("OpenAI.ChatGPT");
        }
        else if (Id.Equals("WisprFlow.WisprFlow", StringComparison.OrdinalIgnoreCase) || Id.Equals("9PNT7HR375BW", StringComparison.OrdinalIgnoreCase))
        {
            candidates.Add("WisprFlow.WisprFlow");
            candidates.Add("9PNT7HR375BW");
        }

        string baseDir = AppDomain.CurrentDomain.BaseDirectory;

        foreach (var name in candidates)
        {
            // 1. External disk check (allows local overrides/custom icons)
            string path = Path.Combine(baseDir, "Assets", "Icons", $"{name}.png");
            if (!File.Exists(path))
            {
                path = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "Icons", $"{name}.png");
            }
            if (!File.Exists(path))
            {
                path = Path.Combine(Directory.GetCurrentDirectory(), "RigForge", "Assets", "Icons", $"{name}.png");
            }

            if (File.Exists(path))
            {
                try
                {
                    var bitmap = new BitmapImage();
                    bitmap.BeginInit();
                    bitmap.UriSource = new Uri(path, UriKind.Absolute);
                    bitmap.CacheOption = BitmapCacheOption.OnLoad;
                    bitmap.EndInit();
                    bitmap.Freeze();
                    return bitmap;
                }
                catch { }
            }

            // 2. Embedded WPF pack URI (embedded inside single executable)
            try
            {
                var uri = new Uri($"pack://application:,,,/Assets/Icons/{name}.png", UriKind.Absolute);
                var streamInfo = Application.GetResourceStream(uri);
                if (streamInfo != null)
                {
                    using var stream = streamInfo.Stream;
                    var bitmap = new BitmapImage();
                    bitmap.BeginInit();
                    bitmap.StreamSource = stream;
                    bitmap.CacheOption = BitmapCacheOption.OnLoad;
                    bitmap.EndInit();
                    bitmap.Freeze();
                    return bitmap;
                }
            }
            catch { }
        }

        return null;
    }

    [JsonIgnore]
    public bool IsOperationActive => Status == PackageStatus.Installing || Status == PackageStatus.Upgrading || Status == PackageStatus.Queued;

    public event PropertyChangedEventHandler? PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    protected bool SetField<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value)) return false;
        field = value;
        OnPropertyChanged(propertyName);
        return true;
    }
}
