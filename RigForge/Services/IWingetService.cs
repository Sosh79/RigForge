using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RigForge.Models;

namespace RigForge.Services;

public interface IWingetService
{
    Task<string?> GetWingetVersionAsync();
    Task<Dictionary<string, string>> ScanInstalledPackagesAsync(
        IEnumerable<SoftwarePackage> packages, 
        Action<string, LogLevel>? logCallback = null, 
        CancellationToken cancellationToken = default);
    Task<bool> InstallPackageAsync(string packageId, Action<string, LogLevel>? logCallback = null, CancellationToken cancellationToken = default);
    Task<bool> UpgradePackageAsync(string packageId, Action<string, LogLevel>? logCallback = null, CancellationToken cancellationToken = default);
    Task<bool> UpgradeAllPackagesAsync(Action<string, LogLevel>? logCallback = null, CancellationToken cancellationToken = default);
}
