import { fetchPostsByCatetoryForWebsite } from "@/app/actions/post-actions";
import { getSignedImageUrl } from "@/app/actions/fetch-file-action";
import PostCard from "@/app/components/PostCard";
import PaginationComp from "@/app/components/PaginationComp";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function page({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pagesize = 10;

  const res = await fetchPostsByCatetoryForWebsite(id, currentPage, pagesize);
  const posts = res.data;
  const totalPages = res.pagination.totalPages;

  // posts with aws image link
  const postsWithImages = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      imageUrl: await getSignedImageUrl(post.imageUrl),
    })),
  );

  return (
    <main className="flex flex-col justify-between items-center  min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-10">
        {postsWithImages.map((post) => {
          return (
            <PostCard
              key={post.id}
              badge={post.category!.name}
              title={post.title}
              description={post.content}
              imageLink={post.imageUrl}
              id={post.id}
            />
          );
        })}
      </div>
      <PaginationComp currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
