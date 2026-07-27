"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  deleteData: (id: string) => Promise<{
    success: boolean;
    msg: string;
  }>;
}

export default function DeleteDataButton({ id, deleteData }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete ?");

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteData(id);
      } catch (error) {
        console.error(error);
        alert("Delete failed");
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
      className="cursor-pointer"
    >
      {isPending ? (
        <span>Deleting...</span>
      ) : (
        <span className="text-red-500">Delete</span>
      )}
    </Button>
  );
}
