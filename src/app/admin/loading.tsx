import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid gap-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[100px] rounded-lg" />
        ))}
      </div>
    </main>
  );
}
