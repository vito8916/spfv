import { Card, CardHeader, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function PricingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,350px))] gap-8 justify-center max-w-6xl mx-auto">
        {[1, 2].map((index) => (
            <Card key={index} className="flex flex-col h-full">
                <CardHeader>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
    );
}