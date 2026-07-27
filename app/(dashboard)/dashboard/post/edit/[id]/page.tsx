import EditAritcleForm from "./EditAritcleForm";
import { findPost } from "@/app/actions/post-actions";
import { fetchAllCategories } from "@/app/actions/category-action";
import { getSignedImageUrl } from "@/app/actions/fetch-file-action";

interface Props {
  params: Promise<{
    id?: string;
  }>;
}

export default async function EditPost({ params }: Props) {
  const { id } = await params;
  const postId = id;

  if (!postId) {
    return <div>No Post Id</div>;
  }

  const res = await findPost(postId);
  const post = res.data;

  if (!post) {
    return <div>Post not found</div>;
  }

  const postWithPresignImageUrl = {
    ...post,
    imageUrl: await getSignedImageUrl(post?.imageUrl),
  };

  const response = await fetchAllCategories();
  const categories = response.data;

  return (
    <EditAritcleForm
      postId={postId}
      post={postWithPresignImageUrl!}
      categories={categories}
    />
  );
}
