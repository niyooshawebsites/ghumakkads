import { BlogHeader } from "@/app/components/BlogHeader";
import { BlogContent } from "@/app/components/BlogContent";
import { findPost } from "@/app/actions/post-actions";
import { getSignedImageUrl } from "@/app/actions/fetch-file-action";
import CommentModal from "@/app/components/CommentModal";
import Comments from "@/app/components/Comments";
import { fetchAllComments } from "@/app/actions/comment-action";
import { Metadata } from "next";
import { ImageGallery } from "@/app/components/ImageGallery";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// attaching meta data for sharing purpose
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const res = await findPost(id);
  const post = res.data;

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.id}`;

  return {
    title: post.title,
    description: post.content.slice(0, 160),

    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      url,
      type: "post",
      images: [
        {
          url: post.imageUrl,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.slice(0, 160),
      images: [post.imageUrl],
    },
  };
}

export default async function page({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;
  const postId = id;
  const currentPage = Number(page ?? 1);

  if (!postId) {
    return <div>No Post Id</div>;
  }

  const commentsRes = await fetchAllComments(postId, currentPage);
  const comments = commentsRes.data;
  const pagination = commentsRes.pagination;

  const res = await findPost(id);
  const post = res.data;

  if (!post) {
    return <div>Post not found</div>;
  }

  const postWithSignedUrl = {
    ...post,
    imageUrl: await getSignedImageUrl(post.imageUrl),
    images: await Promise.all(
      post.images.map(async (img) => ({
        ...img,
        imageUrl: await getSignedImageUrl(img.imageUrl),
      })),
    ),
  };

  return (
    <main className="flex flex-col space-y-3 p-5">
      <BlogHeader
        title={postWithSignedUrl.title}
        category={postWithSignedUrl.category!.name}
        authorName={postWithSignedUrl.author.name}
        authorImg={postWithSignedUrl.author.image}
        imageUrl={postWithSignedUrl.imageUrl}
        createdAt={postWithSignedUrl.createdAt}
      />
      <ImageGallery images={postWithSignedUrl.images} />
      <BlogContent
        id={postWithSignedUrl.id}
        content={postWithSignedUrl.content}
        published={postWithSignedUrl.published}
      />
      <CommentModal postId={postWithSignedUrl.id} />
      <Comments
        comments={comments}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
      />
    </main>
  );
}
