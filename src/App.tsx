import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { AppShell } from '@/components/layouts/app-shell';
import { LoadingSkeleton } from '@/components/layouts/loading-skeleton';
import { ErrorBoundary } from '@/components/error-boundary';
import { DatabaseProvider } from '@/database/database-context';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NotFoundView } from '@/features/not-found-view';

const IdeasDashboard = lazy(() =>
  import('@/features/ideas').then((m) => ({ default: m.IdeasDashboard }))
);
const IdeaCanvas = lazy(() =>
  import('@/features/canvas').then((m) => ({ default: m.IdeaCanvas }))
);
const SearchView = lazy(() =>
  import('@/features/search').then((m) => ({ default: m.SearchView }))
);
const SettingsView = lazy(() =>
  import('@/features/settings').then((m) => ({ default: m.SettingsView }))
);

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/ideas" replace /> },
      {
        path: 'ideas',
        element: (
          <Suspense fallback={<LoadingSkeleton />}>
            <IdeasDashboard />
          </Suspense>
        ),
      },
      {
        path: 'ideas/:id',
        element: (
          <Suspense fallback={<LoadingSkeleton />}>
            <IdeaCanvas />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingSkeleton />}>
            <SearchView />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingSkeleton />}>
            <SettingsView />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFoundView /> },
    ],
  },
]);

function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DatabaseProvider>
          <RouterProvider router={router} />
          <ToastProvider />
        </DatabaseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
