"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { CreateCategory } from "@/app/actions/category-action";
import { toast } from "sonner";

const initialState = {
  success: false,
  msg: "",
};

export default function CreateCategoryForm() {
  const [state, formAction] = useActionState(CreateCategory, initialState);

  useEffect(() => {
    if (!state.success) return;

    if (state.success) {
      toast.success(state.msg, { position: "top-center" });
    } else {
      toast.error(state.msg, { position: "top-center" });
    }
  }, [state]);

  return (
    <div className="flex justify-center items-center w-4/12 md-w-full border border-gray-300 rounded-lg">
      <div className="w-full bg-gray-50 p-5 rounded-lg space-y-3">
        <h1>Fill out the details to create a category: </h1>
        <form action={formAction} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Category name: </FieldLabel>
            <Input
              type="text"
              id="name"
              name="name"
              className="border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-500"
              required
            />
          </Field>

          <Button
            type="submit"
            variant={"default"}
            className="cursor-pointer bg-gray-800 text-white hover:bg-gray-900"
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
