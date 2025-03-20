import { Skeleton } from "@/components/ui/skeleton";

export default function SpFvToolPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">SPFV Tool</h1>
        <p className="text-muted-foreground">
          SPFV Tool is a tool that allows you to manage your SPFV account
          settings and preferences.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-8">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
        </div>
        <Skeleton className="aspect-video rounded-xl" />
      </div>
    </div>
  );
}
