import CategoryTable from "./category-table";
import {
  fetchCategoriesForDashboard,
  searchCategoryForDashboard,
} from "@/app/actions/category-action";
import { auth } from "@/lib/auth";

interface Props {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function AllCategories({ searchParams }: Props) {
  let payload;
  let pagination;
  let count;

  const params = await searchParams;
  const category = params.category ?? null;
  const page = Number(params.page ?? 1);

  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return;

  if (category && page) {
    const res = await searchCategoryForDashboard(category);
    payload = res.data;
    pagination = res.pagination;
    count = res.pagination.totalCategories;
  } else {
    const res = await fetchCategoriesForDashboard({
      page,
      pageSize: 10,
    });
    payload = res.data;
    pagination = res.pagination;
    count = res.pagination.totalCategories;
  }

  return (
    <main className="flex flex-col min-h-screen p-5">
      <h1 className="mb-4 text-2xl font-bold">All Categories {`(${count})`}</h1>

      <CategoryTable
        data={payload}
        pagination={pagination}
        currentPage={page}
      />
    </main>
  );
}
