"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { togglePostStatus } from "../actions/post-actions";

interface Props {
  id: string;
  published: boolean;
}

export function BlogStatus({ id, published }: Props) {
  const router = useRouter();
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant={"outline"}
        className="cursor-pointer"
        onClick={() => router.push("/dashboard/posts")}
      >
        Back
      </Button>
      <Button
        onClick={() => {
          togglePostStatus(id);
          router.push("/dashboard/posts");
        }}
        className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
      >
        {published ? "Draft" : "Publish"}
      </Button>
    </div>
  );
}
