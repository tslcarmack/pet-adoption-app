import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function PetListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters skeleton */}
      <div className="p-4 border rounded-lg bg-card">
        <div className="h-6 w-24 bg-muted rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Pet cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0">
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
