using System;
using System.IO;
using System.Windows;
using System.Windows.Threading;

namespace RigForge;

public partial class App : Application
{
    public App()
    {
        AppDomain.CurrentDomain.UnhandledException += (s, e) =>
        {
            LogCrash("AppDomain", e.ExceptionObject as Exception);
        };

        DispatcherUnhandledException += (s, e) =>
        {
            LogCrash("Dispatcher", e.Exception);
            MessageBox.Show($"Application Error:\n{e.Exception.Message}\n\nStack:\n{e.Exception.StackTrace}", "RigForge Error", MessageBoxButton.OK, MessageBoxImage.Error);
            e.Handled = true;
        };

        TaskScheduler.UnobservedTaskException += (s, e) =>
        {
            LogCrash("TaskScheduler", e.Exception);
            e.SetObserved();
        };
    }

    private static void LogCrash(string source, Exception? ex)
    {
        try
        {
            string logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "startup_error.log");
            string content = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{source}] {ex?.ToString()}\n\n";
            File.AppendAllText(logPath, content);
        }
        catch { }
    }
}
