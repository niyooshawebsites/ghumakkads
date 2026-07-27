import { fetchCategoryForEditForDashboard } from "@/app/actions/category-action";
import EditCategoryForm from "./EditCategoryForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;

  const res = await fetchCategoryForEditForDashboard(id);

  const category = res.data;

  if (!category) return;

  return (
    <div className="flex flex-col justify-start min-h-screen">
      <h1 className="text-2xl font-bold mb-4 content-end">Edit Category</h1>
      <EditCategoryForm id={id} category={category} />
    </div>
  );
}
