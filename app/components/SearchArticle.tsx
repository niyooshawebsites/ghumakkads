"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchPost() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set("post_details", searchTerm);
    } else {
      params.delete("post_details");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Post"
      />

      <Button
        type="submit"
        variant="default"
        className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
      >
        Search
      </Button>
    </form>
  );
}
