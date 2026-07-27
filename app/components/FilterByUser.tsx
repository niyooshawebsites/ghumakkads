"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export function FilterByUser() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set("user_details", searchTerm);
    } else {
      params.delete("user_details");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Fitler By user"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        type="submit"
        variant={"default"}
        className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
      >
        Filter By User
      </Button>
    </form>
  );
}
