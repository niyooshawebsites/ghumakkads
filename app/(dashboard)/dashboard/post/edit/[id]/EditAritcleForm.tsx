"use client";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editPost } from "@/app/actions/post-actions";
import { getPresignedUrl } from "@/app/actions/upload-action";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { Category } from "@/lib/generated/prisma/client";

const initialState = {
  success: false,
  msg: "",
};

interface PostProps {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
}

interface EditPostFormProps {
  postId: string;
  post: PostProps;
  categories: Category[];
}

export default function EditAritcleForm({
  postId,
  post,
  categories,
}: EditPostFormProps) {
  const editPostWithId = editPost.bind(null, postId);
  const [state, formAction] = useActionState(editPostWithId, initialState);
  const [categoryId, setCategoryId] = useState(post.categoryId);
  const [imageKey, setImageKey] = useState(post.imageUrl);
  const [previewUrl, setPreviewUrl] = useState(post.imageUrl);
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));

    try {
      setUploading(true);
      const res = await getPresignedUrl(file.name, file.type);
      await axios.put(res.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      setImageKey(res.key);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  }

  useEffect((): void => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!state.success) return;

    if (state.success) {
      setImageKey("");
      setPreviewUrl(""); // ✅ clear preview
    }

    if (state.success) {
      toast.success(state.msg, { position: "top-center" });
    } else {
      toast.error(state.msg, { position: "top-center" });
    }
  }, [state, imageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="flex justify-center items-center w-10/12 border border-gray-300 rounded-lg">
      <div className="w-full bg-gray-50 p-5 rounded-lg space-y-3">
        <h1 className="text-2xl">Fill out the details to update the post</h1>

        <form action={formAction} className="space-y-4">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <input type="hidden" name="categoryId" value={categoryId} />

          <Field>
            <FieldLabel htmlFor="title">Post Title</FieldLabel>
            <Input
              type="text"
              id="title"
              name="title"
              required
              className="border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-500"
              defaultValue={post.title}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="imageKey">Upload Image</FieldLabel>
            <Input
              type="file"
              id="imageKey"
              accept="image/*"
              onChange={handleFileUpload}
              required
              className="border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-500"
            />

            <input type="hidden" name="imageUrl" value={imageKey} />

            {imageKey && (
              <div className="mt-4">
                <Image
                  src={previewUrl}
                  alt="preview"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="content">Post Content</FieldLabel>
            <Textarea
              id="content"
              name="content"
              required
              className="h-96 border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-500"
              defaultValue={post.content}
            />
          </Field>

          {state.msg && (
            <p
              className={`text-sm ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.msg}
            </p>
          )}

          <Button
            type="submit"
            variant={"default"}
            className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
          >
            {uploading ? "Uploading..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
}
