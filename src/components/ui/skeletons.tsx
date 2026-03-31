import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "./button";
import { Pagination, PaginationContent, PaginationItem } from "./pagination";
import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  rows: number;
  columns: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 border-b pb-2"
          style={{
            gridTemplateColumns: `repeat(${columns ?? 5}, 1fr)`,
          }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex w-full items-center justify-end space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex w-fit items-center justify-center gap-2 text-sm font-medium">
          <span>Page</span>
          <Skeleton className="h-8 w-20" />
          <span>of </span>
          <Skeleton className="h-8 w-6" />
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button variant="outline" size="icon">
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
            {Array.from({ length: 5 }).map((_, index) => (
              <PaginationItem key={index}>
                <Skeleton className="h-10 w-10" />
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button variant="outline" size="icon">
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="size-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export function AIResponseSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
