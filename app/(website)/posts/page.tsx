import {
  fetchPusblishedPosts,
  fetchPostsBySearchTermForWebsite,
} from "@/app/actions/post-actions";
import PostCard from "@/app/components/PostCard";
import { getSignedImageUrl } from "@/app/actions/fetch-file-action";
import PaginationComp from "@/app/components/PaginationComp";
import { FrontendPostSearch } from "@/app/components/FrontendPostSearch";

interface Props {
  searchParams: Promise<{
    page?: string;
    q?: string;
    by?: string;
  }>;
}

export default async function PublishedBlogs({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const q = params.q;
  const by = params.by;

  let res;
  let posts;
  let totalPages;

  if (q || by) {
    res = await fetchPostsBySearchTermForWebsite({
      q,
      by,
      page,
    });
    totalPages = res.pagination!.totalPages;
    posts = res.data;
  } else {
    res = await fetchPusblishedPosts({ page, pageSize: 10 });
    totalPages = res.pagination!.totalPages;
    posts = res.data;
  }

  // posts with aws image link
  const postsWithImages = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      imageUrl: await getSignedImageUrl(post.imageUrl),
    })),
  );

  if (postsWithImages?.length == 0) {
    return (
      <main className="flex min-h-screen p-5">
        <span>No posts yet...</span>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-between min-h-screen ">
      <section className="p-10">
        <FrontendPostSearch />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5">
          {postsWithImages?.map((post) => {
            return (
              <PostCard
                key={post.id}
                badge={`${post.category?.name}`}
                title={post.title}
                description={post.content}
                imageLink={post.imageUrl}
                id={post.id}
              />
            );
          })}
        </div>
      </section>

      <PaginationComp currentPage={page} totalPages={totalPages} />
    </main>
  );
}
