import {
  Select,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FilterByStatus() {
  return (
    <form action="/dashboard/posts" className="flex gap-2">
      <Select name="published">
        <SelectTrigger>
          <SelectValue placeholder={"Filter By Status"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Select Status</SelectItem>
          <SelectGroup>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        type="submit"
        variant="default"
        className="bg-blue-200 text-blue-700 hover:bg-blue-300 cursor-pointer"
      >
        Filter By Status
      </Button>
    </form>
  );
}
