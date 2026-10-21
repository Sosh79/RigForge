using System.Collections.Specialized;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using RigForge.Services;
using RigForge.ViewModels;
using Wpf.Ui.Appearance;

namespace RigForge.Views;

public partial class MainWindow : Wpf.Ui.Controls.FluentWindow
{
    private readonly MainViewModel _viewModel;

    public MainWindow()
    {
        InitializeComponent();

        // Auto-detect system theme and apply matching high-contrast palette
        var systemTheme = ApplicationThemeManager.GetSystemTheme();
        bool isDark = (systemTheme != SystemTheme.Light);
        ThemeService.ApplyTheme(isDark);

        var wingetService = new WingetService();
        _viewModel = new MainViewModel(wingetService)
        {
            IsDarkTheme = isDark
        };
        DataContext = _viewModel;

        // Auto scroll logs to bottom when new entries arrive
        _viewModel.Logs.CollectionChanged += Logs_CollectionChanged;
    }

    private void UpdateMenuBtn_Click(object sender, RoutedEventArgs e)
    {
        if (sender is FrameworkElement element && element.ContextMenu != null)
        {
            element.ContextMenu.PlacementTarget = element;
            element.ContextMenu.Placement = System.Windows.Controls.Primitives.PlacementMode.Bottom;
            element.ContextMenu.IsOpen = true;
        }
    }

    private void Logs_CollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.Action == NotifyCollectionChangedAction.Add && _viewModel.IsLogVisible)
        {
            Dispatcher.InvokeAsync(() =>
            {
                if (FindVisualChild<ListBox>(this) is ListBox listBox && listBox.Items.Count > 0)
                {
                    listBox.ScrollIntoView(listBox.Items[^1]);
                }
            });
        }
    }

    private static T? FindVisualChild<T>(DependencyObject parent) where T : DependencyObject
    {
        int count = VisualTreeHelper.GetChildrenCount(parent);
        for (int i = 0; i < count; i++)
        {
            var child = VisualTreeHelper.GetChild(parent, i);
            if (child is T typedChild)
                return typedChild;

            var descendant = FindVisualChild<T>(child);
            if (descendant != null)
                return descendant;
        }
        return null;
    }
}
