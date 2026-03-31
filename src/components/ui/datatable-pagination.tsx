import { type Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "./button";
import { Input } from "./input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "./pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";
import { useState } from "react";
import { useMediaQuery } from "~/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  enablePageSizeChange?: boolean;
}

export function DataTablePagination<TData>({
  table,
  enablePageSizeChange = false,
}: DataTablePaginationProps<TData>) {
  const [openJumptoPage, setOpenJumptoPage] = useState(false);
  const [openPageSize, setOpenPageSize] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </>
        )}
      </div>
      <div className="flex w-full items-center justify-end space-x-6 lg:space-x-8">
        {enablePageSizeChange && (
          <div className="hidden items-center space-x-2 md:flex">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="hidden w-fit items-center justify-center gap-2 text-sm font-medium md:flex">
          <span>Page</span>
          <Input
            className="h-8 w-fit"
            type="number"
            max={table.getPageCount()}
            min={1}
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 1 || value > table.getPageCount() || isNaN(value)) {
                return;
              }
              table.setPageIndex(value - 1);
            }}
          />
          <span>of {table.getPageCount()}</span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
            {table.getState().pagination.pageIndex > (isDesktop ? 4 : 1) && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {getPageRange(
              table.getState().pagination.pageIndex,
              table.getPageCount(),
              isDesktop ? 4 : 2,
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => table.setPageIndex(page)}
                  isActive={table.getState().pagination.pageIndex === page}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {table.getPageCount() - table.getState().pagination.pageIndex >
              4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="size-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex items-center justify-between md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon">
                <span className="sr-only">Open user menu</span>
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenPageSize(true)}>
                Change page size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenJumptoPage(true)}>
                Jump to page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <JumptoPageDrawer
            open={openJumptoPage}
            onOpenChange={setOpenJumptoPage}
            onPageChange={(index) => {
              if (Number(index) < 1 || Number(index) > table.getPageCount()) {
                return;
              }
              table.setPageIndex(Number(index) - 1);
            }}
            pageIndex={table.getState().pagination.pageIndex}
            totalRows={table.getPageCount()}
          />
          <PageSizeDrawer
            open={openPageSize}
            onOpenChange={setOpenPageSize}
            onPageSizeChange={(pageSize) => table.setPageSize(Number(pageSize))}
            pageSize={table.getState().pagination.pageSize}
          />
        </div>
      </div>
    </div>
  );
}

export function getPageRange(
  currentPage: number,
  pages: number,
  visiblePages = 4,
): number[] {
  const range = Array.from({ length: pages }, (_, i) => i);
  if (pages < visiblePages) {
    return range;
  }
  if (currentPage < visiblePages) {
    return range.slice(0, visiblePages);
  }
  if (currentPage > pages - (visiblePages + 1)) {
    return range.slice(pages - visiblePages, pages);
  }
  return range.slice(
    currentPage - visiblePages / 2,
    currentPage + visiblePages / 2,
  );
}

function JumptoPageDrawer({
  open,
  onOpenChange,
  onPageChange,
  pageIndex,
  totalRows,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPageChange: (pageIndex: number) => void;
  pageIndex: number;
  totalRows: number;
}) {
  const [value, setValue] = useState<number>(pageIndex + 1);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Jump to page</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <Input
            value={value}
            onChange={(e) => setValue(Number(e))}
            type="number"
            min={1}
            max={totalRows}
          />
        </div>
        <DrawerFooter>
          <DrawerClose className="space-y-2">
            <Button className="w-full" onClick={() => onPageChange(value - 1)}>
              Submit
            </Button>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PageSizeDrawer({
  open,
  onOpenChange,
  onPageSizeChange,
  pageSize,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
}) {
  const [value, setValue] = useState<number>(pageSize);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Change page size</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <Select
            value={value.toString()}
            onValueChange={(value) => setValue(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DrawerFooter>
          <DrawerClose className="space-y-2">
            <Button className="w-full" onClick={() => onPageSizeChange(value)}>
              Submit
            </Button>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
