import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVertical,
  Loader2,
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
import { getPageRange } from "./datatable-pagination";

interface CustomPaginationProps {
  totalRows: number;
  loading?: boolean;
  pageIndex?: number;
  pageSize?: number;
  selectedRows?: number;
  enablePageSizeChange?: boolean;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function CustomPagination({
  totalRows,
  loading = true,
  selectedRows,
  pageIndex = 0,
  pageSize = 10,
  enablePageSizeChange = false,
  onPaginationChange,
}: CustomPaginationProps) {
  const [openJumptoPage, setOpenJumptoPage] = useState(false);
  const [openPageSize, setOpenPageSize] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  function onPageChange(pageIndex: number) {
    onPaginationChange?.(pageIndex, pageSize);
  }

  function onPageSizeChange(pageSize: number) {
    onPaginationChange?.(pageIndex, pageSize);
  }

  function getPageCount() {
    return Math.ceil(totalRows / pageSize);
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedRows && (
          <>
            {selectedRows} of {totalRows} row(s) selected.
          </>
        )}
      </div>
      <div className="flex w-full items-center justify-end space-x-6 lg:space-x-8">
        {loading && (
          <div>
            <Loader2 className="size-5 animate-spin" />
            <span className="sr-only">Loading</span>
          </div>
        )}
        {enablePageSizeChange && (
          <div className="hidden items-center space-x-2 md:flex">
            <p className="text-sm font-medium">Items per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
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
            max={getPageCount()}
            min={1}
            value={pageIndex + 1}
            onChange={(e) => {
              if (
                Number(e.target.value) < 1 ||
                Number(e.target.value) > getPageCount()
              ) {
                return;
              }
              onPageChange(Number(e.target.value) - 1);
            }}
          />
          <span>of {getPageCount()}</span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={!pageIndex}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
            {pageIndex > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {getPageRange(pageIndex, getPageCount(), isDesktop ? 4 : 2).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={pageIndex === page}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            {getPageCount() - pageIndex > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pageIndex + 1)}
                disabled={pageIndex === getPageCount() - 1}
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
            onPageChange={onPageChange}
            pageIndex={pageIndex}
            totalRows={totalRows}
          />
          <PageSizeDrawer
            open={openPageSize}
            onOpenChange={setOpenPageSize}
            onPageSizeChange={onPageSizeChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
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
            onChange={(e) => setValue(Number(e.target.value))}
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
