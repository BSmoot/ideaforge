import { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  Lightbulb,
  Search,
  Settings,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { SparkCaptureModal } from '@/features/spark';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

const NAV_ITEMS = [
  { to: '/ideas', label: 'Ideas', icon: Lightbulb },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function AppShell(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const [sparkModalOpen, setSparkModalOpen] = useState(false);

  const shortcuts = useMemo(
    () => ({
      onNewSpark: () => { setSparkModalOpen(true); },
      onSearch: () => { void navigate('/search'); },
      onEscape: () => { setSparkModalOpen(false); },
    }),
    [navigate]
  );
  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-accent-text">IdeaForge</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-subtle text-accent-text'
                    : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface/50 px-4">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-foreground-secondary hover:bg-surface-hover md:hidden"
            aria-label="Toggle sidebar"
            type="button"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1" />

          <Button variant="accent" size="sm" onClick={() => { setSparkModalOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Spark
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <SparkCaptureModal open={sparkModalOpen} onOpenChange={setSparkModalOpen} />
    </div>
  );
}
