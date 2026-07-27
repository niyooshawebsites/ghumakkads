import PostTable from "./post-table";
import {
  fetchAllPosts,
  searchDashboardPost,
  filterPostsByCatetoryForDashboard,
  fitlerPostsByCategoryAndSearchTermForDashboard,
  fetchAllPostsOfAUserForDashboard,
} from "@/app/actions/post-actions";
import { fetchAllCategories } from "@/app/actions/category-action";
import { auth } from "@/lib/auth";

interface Props {
  searchParams: Promise<{
    page?: string;
    post_details?: string;
    user_details?: string;
    category?: string;
  }>;
}

export default async function AllPosts({ searchParams }: Props) {
  let payload;
  let pagination;
  let count;

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const post_details = params.post_details;
  const user_details = params.user_details;
  const cid = params.category;

  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return;

  const categoryResponse = await fetchAllCategories();

  if (cid && post_details && page && userId) {
    const res = await fitlerPostsByCategoryAndSearchTermForDashboard(
      cid,
      post_details,
      page,
      10,
      userId,
    );
    payload = res.data ?? [];
    pagination = res.pagination;
    count = res.pagination.totalPosts;
  } else if (cid && page && userId) {
    const res = await filterPostsByCatetoryForDashboard(cid, page, 10, userId);
    payload = res.data ?? [];
    pagination = res.pagination;
    count = res.pagination.totalPosts;
  } else if (post_details && page && userId) {
    const res = await searchDashboardPost(post_details, page, 10, userId);
    payload = res.data ?? [];
    pagination = res.pagination;
    count = res.pagination.totalPosts;
  } else if (user_details && page) {
    // code goes here
    const res = await fetchAllPostsOfAUserForDashboard(user_details, page);
    payload = res.data ?? [];
    pagination = res.pagination;
    count = res.pagination.totalPosts;
  } else {
    const res = await fetchAllPosts(page, 10, userId);
    payload = res.data ?? [];
    pagination = res.pagination;
    count = res.pagination.totalPosts;
  }

  return (
    <main className="flex flex-col min-h-screen p-5">
      <h1 className="mb-4 text-2xl font-bold">All Posts {`(${count})`}</h1>
      <PostTable
        data={payload}
        pagination={pagination}
        currentPage={page}
        categories={categoryResponse?.data || []}
      />
    </main>
  );
}
