"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import CustomEditor from "@/app/components/CustomEditor";
import { useActionState, useState, useEffect } from "react";
import { createPost } from "@/app/actions/post-actions";
import { getPresignedUrl } from "@/app/actions/upload-action";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import type { Category } from "@/lib/generated/prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Props {
  categories: Category[];
}

const initialState = {
  success: false,
  msg: "",
};

export default function CreatePostForm({ categories }: Props) {
  const [state, formAction] = useActionState(createPost, initialState);
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageKey, setImageKey] = useState<string>("");
  const [galleryKeys, setGalleryKeys] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const res = await getPresignedUrl(file.name, file.type);

      await axios.put(res.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      setImageKey(res.key);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setUploading(true);

    try {
      // Generate preview URLs immediately
      const previews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreview((prev) => [...prev, ...previews]);

      // Upload all files in parallel
      const uploadedKeys = await Promise.all(
        files.map(async (file) => {
          const res = await getPresignedUrl(file.name, file.type);

          await axios.put(res.uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
          });

          return res.key;
        }),
      );

      setGalleryKeys((prev) => [...prev, ...uploadedKeys]);
    } catch (err) {
      console.error(err);
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
      router.push("/dashboard/posts");
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
        <h1>Fill out the details to create an post: </h1>

        <form action={formAction} className="space-y-4">
          <Select onValueChange={setCategoryId}>
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
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="imageKey">Upload Cover Image</FieldLabel>
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
            <FieldLabel>Gallery Images</FieldLabel>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
            />

            {/* Because HTML forms cannot directly send arrays nicely, create a hidden input. */}
            <input
              type="hidden"
              name="galleryImages"
              value={JSON.stringify(galleryKeys)}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryPreview.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt=""
                    width={300}
                    height={200}
                    className="rounded border object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setGalleryPreview((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                      setGalleryKeys((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="content">Post Content</FieldLabel>
            <CustomEditor value={content} onChange={setContent} />
            <input type="hidden" name="content" value={content} />
          </Field>

          <Button
            type="submit"
            variant="default"
            disabled={uploading || !imageKey}
            className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
          >
            {uploading ? "Uploading..." : "Create Post"}
          </Button>
        </form>
      </div>
    </div>
  );
}
