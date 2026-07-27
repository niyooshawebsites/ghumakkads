"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { editCategory } from "@/app/actions/category-action";
import { toast } from "sonner";
import type { Category } from "@/lib/generated/prisma/client";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  msg: "",
};

interface Props {
  id: string;
  category: Category;
}

export default function EditCategoryForm({ id, category }: Props) {
  const editCategoryWithId = editCategory.bind(null, id);
  const [state, formAction] = useActionState(editCategoryWithId, initialState);
  const router = useRouter();

  useEffect((): void => {
    if (!state.success) return;

    if (state.success) {
      toast.success(state.msg, { position: "top-center" });
      router.push("/dashboard/categories");
    } else {
      toast.error(state.msg, { position: "top-center" });
    }
  }, [state, router]);

  return (
    <div className="flex justify-center items-center w-4/12 md-w-full border border-gray-300 rounded-lg">
      <div className="w-full bg-gray-50 p-5 rounded-lg space-y-3">
        <h1>Fill out the details to update the category: </h1>
        <form action={formAction} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Category name: </FieldLabel>
            <Input
              type="text"
              id="name"
              name="name"
              className="border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:broder-gray-500"
              required
              defaultValue={category.name}
            />

            <Button
              type="submit"
              variant={"default"}
              className="cursor-pointer bg-gray-800 text-white hover:bg-gray-900"
            >
              Update
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
