"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteUsers } from "@/app/actions/user-actions";
import { SearchUser } from "@/app/components/SearchUser";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshButton } from "@/app/components/RefreshButton";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { UserWithRelations, columns } from "./columns";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import PaginationComp from "@/app/components/PaginationComp";

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalUsers: number;
  totalPages: number;
}

interface Props {
  data: UserWithRelations[];
  pagination: PaginationMeta;
  currentPage: number;
}

export default function UserTable({ data, pagination, currentPage }: Props) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const selecteIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <>
      {selecteIds.length > 0 && (
        <div className="mb-4">
          <Button
            variant="destructive"
            disabled={selecteIds.length === 0}
            onClick={async () => {
              const confirmation = confirm(
                "Do you really want to delete the data?",
              );

              if (!confirmation) return;
              await deleteUsers(selecteIds);
            }}
          >
            Delete Selected {selecteIds.length}
          </Button>
        </div>
      )}

      {data.length > 0 ? (
        <>
          <div className="flex gap-2 mb-5">
            {/* <FilterByCategory categories={categories} /> |
            <FilterByStatus /> | */}
            <SearchUser />
            {user_details ? (
              <Button
                onClick={() => router.push("/dashboard/users")}
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
                    <span className="text-red-500">No Users found...</span>
                    <RefreshButton resource="users" />
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
          <span className="text-red-500">No Users found...</span>
          <RefreshButton resource="users" />
        </>
      )}
    </>
  );
}
