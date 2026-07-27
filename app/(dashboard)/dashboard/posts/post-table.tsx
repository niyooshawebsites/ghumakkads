"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deletePosts } from "@/app/actions/post-actions";
import { SearchPost } from "@/app/components/SearchPost";
import { FilterByCategory } from "@/app/components/FilterByCategory";
import { FilterByUser } from "@/app/components/FilterByUser";
import type { Category } from "@/lib/generated/prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshButton } from "@/app/components/RefreshButton";
import { useSession } from "next-auth/react";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  RowSelectionState,
} from "@tanstack/react-table";

import { columns, PostWithRelations } from "./columns";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

import PaginationComp from "@/app/components/PaginationComp";
import { FilterByStatus } from "@/app/components/FilterByStatus";

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

interface Props {
  data: PostWithRelations[];
  pagination: PaginationMeta;
  currentPage: number;
  categories: Category[] | [];
}

export default function PostTable({
  data,
  pagination,
  currentPage,
  categories,
}: Props) {
  const { data: session } = useSession();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const post_details = searchParams.get("post_details");
  const user_details = searchParams.get("user_details");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="mb-4">
          <Button
            variant="destructive"
            disabled={selectedIds.length === 0}
            onClick={async () => {
              const confirmation = confirm(
                "Do you really want to delete the data?",
              );
              if (!confirmation) return;
              await deletePosts(selectedIds);
            }}
            className="cursor-pointer"
          >
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}

      {data.length > 0 ? (
        <>
          <div className="flex gap-2 mb-5">
            <FilterByCategory categories={categories} /> |
            <FilterByStatus /> |
            <SearchPost />
            {session?.user.role === 1 ? (
              <>
                |
                <FilterByUser />
              </>
            ) : null}
            {category || post_details || user_details ? (
              <Button
                onClick={() => router.push("/dashboard/posts")}
                variant="destructive"
                className="cursor-pointer"
              >
                Clear Filters
              </Button>
            ) : null}
          </div>

          <Table className="p-3 w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                  <TableCell colSpan={3} className="text-center py-6">
                    <div>
                      <span className="text-red-500">No Posts found...</span>
                      <RefreshButton resource="posts" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <PaginationComp
            currentPage={currentPage}
            totalPages={pagination.totalPages}
          />
        </>
      ) : (
        <>
          <span className="text-red-500">No Posts found...</span>
          <RefreshButton resource="posts" />
        </>
      )}
    </>
  );
}
