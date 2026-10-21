namespace RigForge.Models;

public enum PackageStatus
{
    Idle,
    Queued,
    Installing,
    Installed,
    Upgrading,
    Success,
    Failed,
    Skipped
}
