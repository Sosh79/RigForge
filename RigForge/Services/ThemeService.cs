using System;
using System.Windows;
using System.Windows.Media;
using Wpf.Ui.Appearance;
using Wpf.Ui.Controls;

namespace RigForge.Services;

public static class ThemeService
{
    public static void ApplyTheme(bool isDark)
    {
        var app = Application.Current;
        if (app == null) return;

        var theme = isDark ? ApplicationTheme.Dark : ApplicationTheme.Light;

        try
        {
            ApplicationThemeManager.Apply(theme, WindowBackdropType.Mica, true);
        }
        catch
        {
            // Ignore backdrop platform exceptions if running on older OS build
        }

        if (isDark)
        {
            SetBrush(app, "AppPageBackgroundBrush", Color.FromRgb(11, 15, 25));
            SetBrush(app, "AppCardBackgroundBrush", Color.FromRgb(21, 29, 44));
            SetBrush(app, "AppCardBorderBrush", Color.FromRgb(38, 51, 77));
            SetBrush(app, "AppTextPrimaryBrush", Color.FromRgb(248, 250, 252));
            SetBrush(app, "AppTextSecondaryBrush", Color.FromRgb(148, 163, 184));
            SetBrush(app, "AppTextMutedBrush", Color.FromRgb(100, 116, 139));
            SetBrush(app, "AppControlBackgroundBrush", Color.FromRgb(26, 35, 51));
            SetBrush(app, "AppControlBorderBrush", Color.FromRgb(45, 59, 84));
            SetBrush(app, "AppBadgeBackgroundBrush", Color.FromRgb(30, 41, 59));

            // Disabled state brushes for Dark theme
            SetBrush(app, "AppDisabledButtonBackgroundBrush", Color.FromRgb(30, 41, 59));
            SetBrush(app, "AppDisabledButtonBorderBrush", Color.FromRgb(51, 65, 85));
            SetBrush(app, "AppDisabledButtonForegroundBrush", Color.FromRgb(148, 163, 184));
            SetBrush(app, "AppDisabledBadgeBackgroundBrush", Color.FromRgb(15, 23, 42));
            SetBrush(app, "AppDisabledBadgeForegroundBrush", Color.FromRgb(148, 163, 184));
        }
        else
        {
            SetBrush(app, "AppPageBackgroundBrush", Color.FromRgb(248, 250, 252));
            SetBrush(app, "AppCardBackgroundBrush", Color.FromRgb(255, 255, 255));
            SetBrush(app, "AppCardBorderBrush", Color.FromRgb(226, 232, 240));
            SetBrush(app, "AppTextPrimaryBrush", Color.FromRgb(15, 23, 42)); // High-contrast Slate 900
            SetBrush(app, "AppTextSecondaryBrush", Color.FromRgb(71, 85, 105)); // High-contrast Slate 600
            SetBrush(app, "AppTextMutedBrush", Color.FromRgb(100, 116, 139));
            SetBrush(app, "AppControlBackgroundBrush", Color.FromRgb(241, 245, 249));
            SetBrush(app, "AppControlBorderBrush", Color.FromRgb(203, 213, 225));
            SetBrush(app, "AppBadgeBackgroundBrush", Color.FromRgb(226, 232, 240));

            // Disabled state brushes for Light theme (high contrast, crisp & clear)
            SetBrush(app, "AppDisabledButtonBackgroundBrush", Color.FromRgb(226, 232, 240)); // Slate 200
            SetBrush(app, "AppDisabledButtonBorderBrush", Color.FromRgb(203, 213, 225));     // Slate 300
            SetBrush(app, "AppDisabledButtonForegroundBrush", Color.FromRgb(51, 65, 85));    // Slate 700
            SetBrush(app, "AppDisabledBadgeBackgroundBrush", Color.FromRgb(203, 213, 225));  // Slate 300
            SetBrush(app, "AppDisabledBadgeForegroundBrush", Color.FromRgb(15, 23, 42));     // Slate 900
        }
    }

    private static void SetBrush(Application app, string key, Color color)
    {
        var brush = new SolidColorBrush(color);
        brush.Freeze();
        app.Resources[key] = brush;
    }
}
