"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDataButton from "@/app/components/DeleteButton";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteUser } from "@/app/actions/user-actions";
import { Prisma } from "@/lib/generated/prisma/client";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    posts: true;
    comments: true;
  };
}>;

export const columns: ColumnDef<UserWithRelations>[] = [
  {
    id: "Select",
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "posts",
    header: () => <div className="text-center">Posts</div>,
    cell: ({ row }) => (
      <p className="text-center">{row.original?.posts?.length}</p>
    ),
  },
  {
    accessorKey: "comments",
    header: () => <div className="text-center">Comments</div>,
    cell: ({ row }) => (
      <p className="text-center">{row.original?.comments?.length}</p>
    ),
  },
  {
    accessorKey: "emailVerified",
    header: () => <div className="text-center">Verified</div>,
    cell: ({ row }) =>
      row.original.emailVerified ? (
        <div className="text-center">
          <span className="bg-blue-200 px-2 py-1 rounded-lg text-blue-700">
            Yes
          </span>
        </div>
      ) : (
        <div className="text-center">
          <span className="bg-red-200 px-2 py-1 text-red-700 rounded-lg">
            No
          </span>
        </div>
      ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.original.createdAt).toLocaleDateString("en-IN")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-center">
          <DeleteDataButton id={user.id} deleteData={deleteUser} />
        </div>
      );
    },
  },
];
