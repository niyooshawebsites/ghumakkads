"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteDataButton from "@/app/components/DeleteButton";
import { deletePost } from "@/app/actions/post-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { Prisma } from "@/lib/generated/prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    comments: {
      select: {
        id: true;
        content: true;
        authorId: true;
        postId: true;
      };
    };
    author: {
      select: {
        id: true;
        name: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export interface Post {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  } | null;
  published: boolean;
  createdAt: Date;
}

function ActionCell({ post }: { post: Post }) {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center gap-2">
      <Link href={`/dashboard/post/${post.id}`}>
        <Button
          size="sm"
          variant="default"
          className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
        >
          View
        </Button>
      </Link>
      <Link href={`/dashboard/post/edit/${post.id}`}>
        <Button
          size="sm"
          variant="outline"
          className="text-gray-700 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:text-gray-700"
        >
          Edit
        </Button>
      </Link>

      {session?.user?.role === 1 && (
        <DeleteDataButton id={post.id} deleteData={deletePost} />
      )}
    </div>
  );
}

export const columns: ColumnDef<PostWithRelations>[] = [
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
    id: "Serial",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Post Title",
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "No Category",
  },
  {
    accessorKey: "author.name",
    header: "User",
    cell: ({ row }) => row.original.author.name,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toString().split(" GMT")[0],
  },
  {
    accessorKey: "published",
    header: () => <div className="text-center">Published</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.published ? (
          // className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
          <span className="bg-blue-300 px-2 py-1 rounded-lg text-blue-700">
            Yes
          </span>
        ) : (
          <span className="bg-red-300 px-2 py-1 text-red-700 rounded-lg">
            No
          </span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionCell post={row.original} />,
  },
];
