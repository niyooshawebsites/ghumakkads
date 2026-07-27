"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteDataButton from "@/app/components/DeleteButton";
import { deleteCategory } from "@/app/actions/category-action";
import { Checkbox } from "@/components/ui/checkbox";

export interface Category {
  id: string;
  name: string;
}

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    id: "serial",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
  },

  {
    accessorKey: "name",
    header: "Category Name",
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex justify-center gap-2">
          <Link href={`/dashboard/category/edit/${category.id}`}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>

          <DeleteDataButton id={category.id} deleteData={deleteCategory} />
        </div>
      );
    },
  },
];
