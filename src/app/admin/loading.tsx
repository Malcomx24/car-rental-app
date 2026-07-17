import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden lg:flex flex-col w-64 border-r bg-sidebar p-4 gap-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background/80 flex items-center px-6">
          <Skeleton className="h-6 w-32" />
        </header>
        <main className="flex-1 p-6 space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    </div>
  );
}
