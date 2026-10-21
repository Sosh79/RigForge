using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;
using System.Windows.Media;
using RigForge.Models;

namespace RigForge.Converters;

public class StatusToColorConverter : IValueConverter
{
    private static readonly SolidColorBrush GrayBrush = new(Color.FromArgb(180, 160, 160, 160));
    private static readonly SolidColorBrush BlueBrush = new(Color.FromRgb(0, 120, 215));
    private static readonly SolidColorBrush GreenBrush = new(Color.FromRgb(16, 185, 129));
    private static readonly SolidColorBrush OrangeBrush = new(Color.FromRgb(245, 158, 11));
    private static readonly SolidColorBrush RedBrush = new(Color.FromRgb(239, 68, 68));

    static StatusToColorConverter()
    {
        GrayBrush.Freeze();
        BlueBrush.Freeze();
        GreenBrush.Freeze();
        OrangeBrush.Freeze();
        RedBrush.Freeze();
    }

    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is PackageStatus status)
        {
            return status switch
            {
                PackageStatus.Installing or PackageStatus.Upgrading => BlueBrush,
                PackageStatus.Success or PackageStatus.Installed => GreenBrush,
                PackageStatus.Queued => OrangeBrush,
                PackageStatus.Failed => RedBrush,
                _ => GrayBrush
            };
        }
        return GrayBrush;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => throw new NotImplementedException();
}

public class StatusToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is PackageStatus status && parameter is string targetStatusStr)
        {
            if (Enum.TryParse<PackageStatus>(targetStatusStr, out var targetStatus))
            {
                return status == targetStatus ? Visibility.Visible : Visibility.Collapsed;
            }
        }
        return Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => throw new NotImplementedException();
}

public class LogLevelToBrushConverter : IValueConverter
{
    private static readonly SolidColorBrush InfoBrush = new(Color.FromRgb(209, 213, 219));
    private static readonly SolidColorBrush SuccessBrush = new(Color.FromRgb(52, 211, 153));
    private static readonly SolidColorBrush WarningBrush = new(Color.FromRgb(251, 191, 36));
    private static readonly SolidColorBrush ErrorBrush = new(Color.FromRgb(248, 113, 113));
    private static readonly SolidColorBrush WingetBrush = new(Color.FromRgb(56, 189, 248));

    static LogLevelToBrushConverter()
    {
        InfoBrush.Freeze();
        SuccessBrush.Freeze();
        WarningBrush.Freeze();
        ErrorBrush.Freeze();
        WingetBrush.Freeze();
    }

    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is LogLevel level)
        {
            return level switch
            {
                LogLevel.Success => SuccessBrush,
                LogLevel.Warning => WarningBrush,
                LogLevel.Error => ErrorBrush,
                LogLevel.Winget => WingetBrush,
                _ => InfoBrush
            };
        }
        return InfoBrush;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => throw new NotImplementedException();
}

public class InverseBooleanConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is bool b) return !b;
        return true;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is bool b) return !b;
        return false;
    }
}
