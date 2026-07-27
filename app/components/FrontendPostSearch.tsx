"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export function FrontendPostSearch() {
  const [postDetails, setPostDetails] = useState<string>("");
  const [searchBy, setSearchBy] = useState<string>("");
  const router = useRouter();

  const params = useSearchParams();
  const q = params.get("q");
  const by = params.get("by");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams({
      q: postDetails,
      by: searchBy,
      page: "1",
    });

    router.push(`/posts?${params.toString()}`);
  }

  return (
    <div className="flex justify-center gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
        <Input
          type="text"
          placeholder="Search Posts"
          value={postDetails}
          onChange={(e) => setPostDetails(e.target.value)}
          name="q"
          required
        />

        <Select onValueChange={setSearchBy} required name="by">
          <SelectTrigger>
            <SelectValue placeholder="Search By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <input type="hidden" name="searchBy" value={searchBy} />

        <Button
          type="submit"
          variant="outline"
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
        >
          Search
        </Button>
      </form>

      {q || by ? (
        <Button
          type="button"
          variant={"default"}
          className="bg-red-500 text-white cursor-pointer hover:bg-red-600"
          onClick={() => router.push("/posts")}
        >
          Clear Filter
        </Button>
      ) : null}
    </div>
  );
}
