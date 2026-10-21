using System;
using System.Threading;
using System.Threading.Tasks;
using RigForge.Models;

namespace RigForge.Services;

public interface IUpdateService
{
    string CurrentVersion { get; }
    Task<UpdateInfo?> CheckForUpdatesAsync(CancellationToken cancellationToken = default);
    Task<bool> DownloadAndApplyUpdateAsync(
        string downloadUrl,
        IProgress<double>? progress = null,
        Action<string>? statusCallback = null,
        CancellationToken cancellationToken = default);
}
