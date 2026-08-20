import { KalaConnectIcon } from "@/components/icons";

export function BrandLoading({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${fullScreen ? "min-h-screen" : "min-h-[60vh]"} px-4`}>
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-primary/10 border-t-primary" />
        <span className="absolute -inset-2 animate-spin rounded-full border-2 border-primary/15 border-b-primary [animation-direction:reverse] [animation-duration:1.4s]" />
        <KalaConnectIcon className="h-12 w-12 animate-pulse rounded-full" width={48} height={48} />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold tracking-wide text-primary">
          कला<span className="text-foreground">Connect</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Crafting something beautiful…</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary/40" />
      </div>
    </div>
  );
}