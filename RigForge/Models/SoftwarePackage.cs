using System.ComponentModel;
using System.IO;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace RigForge.Models;

public class SoftwarePackage : INotifyPropertyChanged
{
    private bool _isSelected;
    private PackageStatus _status = PackageStatus.Idle;
    private string _statusMessage = "Ready";
    private bool _isInstalled;
    private string _installedVersion = string.Empty;
    private double _progress;

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
    public string IconPath
    {
        get
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string path = Path.Combine(baseDir, "Assets", "Icons", $"{Id}.png");
            if (File.Exists(path)) return path;

            path = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "Icons", $"{Id}.png");
            if (File.Exists(path)) return path;

            path = Path.Combine(Directory.GetCurrentDirectory(), "RigForge", "Assets", "Icons", $"{Id}.png");
            if (File.Exists(path)) return path;

            return string.Empty;
        }
    }

    [JsonIgnore]
    public bool HasIcon => !string.IsNullOrEmpty(IconPath);

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
