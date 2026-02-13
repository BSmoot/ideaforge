export function LoadingSkeleton(): React.ReactElement {
  return (
    <div className="flex h-screen bg-steel-950">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r border-steel-800 bg-steel-900 md:block">
        <div className="flex h-16 items-center gap-2 border-b border-steel-800 px-4">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-steel-800" />
          <div className="h-5 w-24 animate-pulse rounded bg-steel-800" />
        </div>
        <div className="space-y-2 p-3">
          <div className="h-9 animate-pulse rounded-lg bg-steel-800" />
          <div className="h-9 animate-pulse rounded-lg bg-steel-800" />
          <div className="h-9 animate-pulse rounded-lg bg-steel-800" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center border-b border-steel-800 px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-steel-800" />
        </div>
        <div className="flex-1 p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-steel-800 mb-6" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg bg-steel-800/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
