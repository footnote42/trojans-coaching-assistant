import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SessionPlanSkeletonProps {
  stage?: string;
}

export function SessionPlanSkeleton({ stage = "Generating your session plan..." }: SessionPlanSkeletonProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Loading status indicator */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {stage}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                This typically takes 10-30 seconds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Summary Skeleton */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-56" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Session Plan Skeleton */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity sections skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              {/* Activity header */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-64" />
              </div>

              {/* Activity content */}
              <div className="space-y-2 pl-7">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                {/* Sub-sections */}
                <div className="pt-2 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>

                <div className="pt-2 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>

              {/* Divider */}
              {i < 4 && (
                <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
              )}
            </div>
          ))}

          {/* Copy button skeleton */}
          <Skeleton className="h-10 w-full rounded-lg mt-6" />
        </CardContent>
      </Card>
    </div>
  );
}
