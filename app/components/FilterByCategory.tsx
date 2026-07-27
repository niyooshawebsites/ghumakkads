import {
  Select,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/generated/prisma/client";

interface Props {
  categories: Category[] | [];
}

export function FilterByCategory({ categories }: Props) {
  return (
    <form action="/dashboard/posts" className="flex gap-2">
      <Select name="category">
        <SelectTrigger>
          <SelectValue placeholder={"Filter By Category"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Select Category</SelectItem>
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        type="submit"
        variant="default"
        className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
      >
        Filter By Category
      </Button>
    </form>
  );
}
