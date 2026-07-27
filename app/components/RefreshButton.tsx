"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  resource: string;
}

export function RefreshButton({ resource }: Props) {
  const router = useRouter();
  return (
    <div className="my-2">
      <Button
        type="button"
        variant="default"
        className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
        onClick={() => router.push(`/dashboard/${resource}`)}
      >
        Refresh
      </Button>
    </div>
  );
}
