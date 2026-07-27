import { BlogHeader } from "@/app/components/BlogHeader";
import { BlogContent } from "@/app/components/BlogContent";
import { BlogStatus } from "@/app/components/BlogStatus";
import { findPost } from "@/app/actions/post-actions";
import { getSignedImageUrl } from "@/app/actions/fetch-file-action";
import { auth } from "@/lib/auth";
import { ImageGallery } from "@/app/components/ImageGallery";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  const postId = id;

  if (!session) return;

  if (!postId) {
    return <div>No Post Id</div>;
  }

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
    <main className="flex flex-col space-y-3">
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

      {session.user.role === 1 ? (
        <BlogStatus
          id={postWithSignedUrl.id}
          published={postWithSignedUrl.published}
        />
      ) : null}
    </main>
  );
}
