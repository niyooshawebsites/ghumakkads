import Image from "next/image";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  ItemMedia,
} from "@/components/ui/item";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PaginationComp from "./PaginationComp";

type CommentsWithRelations = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        name: true;
        image: true;
      };
    };
    post: {
      select: {
        title: true;
      };
    };
  };
}>;

interface Props {
  comments: CommentsWithRelations[];
  currentPage: number;
  totalPages: number;
}

export default async function Comments({
  comments,
  currentPage,
  totalPages,
}: Props) {
  return (
    <>
      {comments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-gray-800">
              Comments:{" "}
              {comments.length < 10 ? `0${comments.length}` : comments.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup className="gap-4">
              {comments.map((comment) => (
                <Item
                  key={comment.id}
                  variant="outline"
                  role="listitem"
                  asChild
                >
                  <div className="flex justify-between">
                    <div className="flex">
                      {/* profile pic */}
                      <ItemMedia variant="image">
                        <Image
                          src={
                            comment.author.image
                              ? `${comment.author.image}`
                              : `/avatar.jpg`
                          }
                          alt={comment.post.title}
                          width={32}
                          height={32}
                          className="object-cover grayscale"
                        />
                      </ItemMedia>

                      {/* name and content */}
                      <ItemContent>
                        <ItemTitle className="font-bold text-gray-700">
                          {comment.author.name}
                        </ItemTitle>
                        <ItemDescription>{comment.content}</ItemDescription>
                      </ItemContent>
                    </div>

                    {/* time */}
                    <ItemContent className="flex-none text-center">
                      <ItemDescription>
                        {comment.createdAt.toLocaleString()}
                      </ItemDescription>
                    </ItemContent>
                  </div>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
          <CardFooter>
            <PaginationComp currentPage={currentPage} totalPages={totalPages} />
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Comments: </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>No comments for this post yet!</CardDescription>
          </CardContent>
        </Card>
      )}
    </>
  );
}
