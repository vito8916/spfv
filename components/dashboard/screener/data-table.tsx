"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  ColumnPinningState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Search, SlidersHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ScreenerSkeleton from "@/components/skeletons/screener-skeleton"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
}


export function ScreenerDataTable<TData, TValue>({
                                                   columns,
                                                   data,
                                                   isLoading = false,
                                                 }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['symbol'], // Pin the symbol column by default
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnPinningChange: setColumnPinning,
    enableColumnPinning: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
      columnPinning,
    },
  })

  function downloadCSV() {
    // Get visible columns
    const headers = columns
        .filter(column => {
          // @ts-expect-error - accessorKey exists on our columns
          const key = column.accessorKey as string
          return columnVisibility[key] !== false
        })
        // @ts-expect-error - accessorKey exists on our columns
        .map(column => column.accessorKey as string)

    // Create CSV header row
    let csv = headers.join(',') + '\n'

    // Add data rows
    table.getFilteredRowModel().rows.forEach(row => {
      const values = headers.map(header => {
        const value = row.getValue(header)
        // Handle special values like dates or numbers
        if (value instanceof Date) {
          return value.toISOString()
        }
        // Escape commas in string values
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      })
      csv += values.join(',') + '\n'
    })

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'spfv_screener_data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <CardTitle className="text-lg flex items-center">
              Screener Results
              {!isLoading && <span className="ml-2 text-xs text-muted-foreground">({table.getFilteredRowModel().rows.length} items)</span>}
            </CardTitle>
            <CardDescription>Options matching your criteria</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-end">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search all columns..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-8 w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                          <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                              }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                      )
                    })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
              <ScreenerSkeleton />
          ) : (
              <>
                <ScrollArea className="h-[calc(100vh-26rem)] rounded-md">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id} className="sticky top-0 bg-card z-5 hover:bg-card">
                            {headerGroup.headers.map((header) => {
                              return (
                                  <TableHead
                                      key={header.id}
                                      className={cn(
                                          "sticky",
                                          header.column.getIsPinned() === 'left' && "left-0 z-30 bg-card pinned-column",
                                          header.column.getIsPinned() === 'right' && "right-0 z-30 bg-card pinned-column"
                                      )}
                                  >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                  </TableHead>
                              )
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
                                  className="hover:bg-muted/50 cursor-pointer"
                              >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={cn(
                                            "sticky",
                                            cell.column.getIsPinned() === 'left' && "left-0 z-1 bg-background pinned-column",
                                            cell.column.getIsPinned() === 'right' && "right-0 z-10 bg-background pinned-column"
                                        )}
                                    >
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                              </TableRow>
                          ))
                      ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                              No results found.
                            </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length > 0
                      ? `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${Math.min(
                          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                          table.getFilteredRowModel().rows.length
                      )}`
                      : "0"} of {table.getFilteredRowModel().rows.length} rows
                  </div>
                  <div className="flex items-center gap-4">
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                          table.setPageSize(Number(value))
                        }}
                    >
                      <SelectTrigger className="h-8 w-[100px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50, 100, 500].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                              {pageSize} rows
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.setPageIndex(0)}
                          disabled={!table.getCanPreviousPage()}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </span>
                      </div>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                          disabled={!table.getCanNextPage()}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
          )}
        </CardContent>
      </Card>
  )
}
