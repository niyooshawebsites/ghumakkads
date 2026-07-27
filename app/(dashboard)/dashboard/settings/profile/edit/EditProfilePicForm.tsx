"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useActionState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { updatePassword } from "@/app/actions/auth-actions";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { signOut } from "next-auth/react";
import { getPresignedUrl } from "@/app/actions/upload-action";
import Image from "next/image";
import axios from "axios";

const initialState = {
  success: false,
  msg: "",
};

export default function EditProfilePicForm() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const action = updatePassword.bind(null, userId as string);
  const [state, formAction] = useActionState(action, initialState);
  const [imageKey, setImageKey] = useState<string>("");
  const [previeUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

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

  useEffect(() => {
    if (!state.msg) return;

    if (state.success) {
      toast.success(state.msg, { position: "top-center" });

      const timer = setTimeout(async () => {
        await signOut({
          callbackUrl: "/login",
        });
      }, 1500);

      return () => clearTimeout(timer);
    }

    toast.error(state.msg, { position: "top-center" });
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="imageKey">Profile Picture: </FieldLabel>
        <InputGroup>
          <InputGroupInput
            type="file"
            placeholder="Upload profile picture"
            id="imageKey"
            accept="image/*"
            className="border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-500"
            onChange={handleFileUpload}
            required
          />
        </InputGroup>

        <input type="hidden" name="image" value={imageKey} />

        {imageKey && (
          <div className="mt-4">
            <Image
              src={previeUrl}
              alt="preview"
              width={200}
              height={200}
              className="rounded border"
            />
          </div>
        )}
      </Field>

      <Button
        type="submit"
        variant={"default"}
        className="cursor-pointer bg-gray-800 text-white hover:bg-gray-900"
      >
        {uploading ? "Uploading..." : "Update Profile Picture"}
      </Button>
    </form>
  );
}
