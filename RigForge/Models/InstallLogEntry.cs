using System;

namespace RigForge.Models;

public enum LogLevel
{
    Info,
    Success,
    Warning,
    Error,
    Winget
}

public class InstallLogEntry
{
    public DateTime Timestamp { get; } = DateTime.Now;
    public string Message { get; set; } = string.Empty;
    public LogLevel Level { get; set; } = LogLevel.Info;

    public string FormattedTime => Timestamp.ToString("HH:mm:ss");

    public override string ToString()
    {
        return $"[{FormattedTime}] [{Level.ToString().ToUpper()}] {Message}";
    }
}
