"use client";

import {
  type Table as ReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type TableState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { cn, useMediaQuery } from "~/lib/utils";

import { Checkbox } from "./checkbox";
import { Button } from "~/components/ui/button";
import { DataTablePagination } from "~/components/ui/datatable-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sortable?: boolean;
  selectable?: boolean;
  useManualPagination?: boolean;
  manualPagination?: {
    totalRows: number;
  };
  onPaginationChange?: OnChangeFn<PaginationState>;
  defaultPageSize?: number;
  state?: Partial<TableState>;
  enablePageSizeChange?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sortable = false,
  selectable = false,
  useManualPagination = false,
  manualPagination,
  onPaginationChange,
  defaultPageSize = 10,
  state,
  enablePageSizeChange = false,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns: selectable
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ cell }) => (
              <Checkbox
                checked={cell.row.getIsSelected()}
                onCheckedChange={(value) => cell.row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
          ...columns,
        ]
      : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: useManualPagination,
    rowCount: manualPagination?.totalRows,
    state: {
      ...state,
      sorting,
      rowSelection,
    },
    ...(useManualPagination ? { onPaginationChange } : {}),
  });

  useEffect(() => {
    defaultPageSize && table.setPageSize(defaultPageSize);
  }, []);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="rounded-md">
        {isDesktop ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "hover:bg-accent",
                          // @ts-expect-error - `classname` not in meta - cry about it
                          // prettier-ignore
                          header.column.columnDef.meta?.headerClassName as string,
                        )}
                      >
                        {header.id === "select" || !sortable ? (
                          header.isPlaceholder ? null : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )
                        ) : (
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-between p-0 hover:bg-transparent",
                              // @ts-expect-error - `btnClassName` not in meta - cry about it
                              // prettier-ignore
                              header.column.columnDef.meta?.btnClassName as string,
                            )}
                            onClick={() =>
                              header.column.toggleSorting(
                                header.column.getIsSorted() === "asc",
                              )
                            }
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          // @ts-expect-error - `cellClassName` not in meta - cry about it
                          cell.column.columnDef.meta?.cellClassName as string
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <MobileTable {...table} />
        )}
      </div>
      <div className="py-4">
        <DataTablePagination
          table={table}
          enablePageSizeChange={enablePageSizeChange}
        />
      </div>
    </div>
  );
}

export function MobileTable<TData>(table: ReactTable<TData>) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="rounded-md">
        <Accordion type="single" collapsible>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <AccordionItem value={row.id} key={row.id}>
                <AccordionTrigger className="space-x-2">
                  <div className="flex w-full items-center justify-between">
                    {row
                      .getVisibleCells()
                      .filter(
                        (cell) =>
                          // @ts-expect-error - `inAccordionTrigger` not in meta - cry about it
                          cell.column.columnDef.meta?.inAccordionTrigger ??
                          false,
                      )
                      .map((cell) => (
                        <Fragment key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Fragment>
                      ))}
                  </div>
                </AccordionTrigger>
                {row.getVisibleCells().map((cell) =>
                  // @ts-expect-error - `inAccordionContent` not in meta - cry about it
                  !cell.column.columnDef.meta?.inAccordionContent ?? false ? (
                    <AccordionContent key={cell.id}>
                      {cell.column.columnDef.header as string}
                      <br />
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </AccordionContent>
                  ) : (
                    <></>
                  ),
                )}
              </AccordionItem>
            ))
          ) : (
            <div className="h-24 text-center">No results.</div>
          )}
        </Accordion>
      </div>
    </div>
  );
}
