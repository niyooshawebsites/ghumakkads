import CreateCategoryForm from "./CreateCategoryForm";

export default function CreateCategory() {
  return (
    <div className="flex flex-col justify-start min-h-screen">
      <h1 className="text-2xl font-bold mb-4 content-end">Create Category</h1>
      <CreateCategoryForm />
    </div>
  );
}
