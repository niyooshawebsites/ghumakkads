"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createComment } from "../actions/comment-action";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  msg: "",
};

interface Props {
  postId: string;
}

export default function CommentModal({ postId }: Props) {
  const [open, setOpen] = useState(false);
  const createCommentWithPostId = createComment.bind(null, postId);
  const [state, formAction] = useActionState(
    createCommentWithPostId,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state.success) return;

    if (state.success) {
      toast.success(state.msg, { position: "top-center" });

      queueMicrotask(() => {
        setOpen(false);
        router.refresh();
      });
    } else {
      toast.error(state.msg, { position: "top-center" });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
        >
          Drop a Comment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form className="space-y-3" action={formAction}>
          <DialogHeader>
            <DialogTitle>Add comment</DialogTitle>
            <DialogDescription>
              Write your heart out and share it with everyone.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your comment here"
                required
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" className="cursor-pointer">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
