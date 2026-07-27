import CreatePostForm from "./CreatePostForm";
import { fetchAllCategories } from "@/app/actions/category-action";

export default async function CreatePost() {
  const res = await fetchAllCategories();
  const categories = res.data;

  return (
    <div className="flex flex-col justify-start min-h-screen">
      <h1 className="text-2xl font-bold mb-4 content-end">Create Post</h1>
      <CreatePostForm categories={categories} />
    </div>
  );
}
