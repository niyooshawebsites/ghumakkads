"use client";

import DOMPurify from "isomorphic-dompurify";
import {
  Card,
  CardAction,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Post {
  badge: string;
  title: string;
  description: string;
  imageLink: string;
  id: string;
}

export default function PostCard({
  badge,
  title,
  description,
  imageLink,
  id,
}: Post) {
  const cleanContent = DOMPurify.sanitize(description);
  const router = useRouter();

  return (
    <Card
      className="relative mx-auto w-full max-w-sm pt-0 border-0 self-start cursor-pointer hover:scale-102 transition-all"
      onClick={() => router.push(`/post/${id}`)}
    >
      <img
        src={imageLink}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover"
      />

      <CardHeader className="">
        <CardAction>
          <Badge variant={"secondary"} className="bg-blue-500 text-white">
            {badge}
          </Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardDescription className="line-clamp-3 px-3">
        <div
          dangerouslySetInnerHTML={{
            __html: cleanContent,
          }}
        />
      </CardDescription>
      <CardFooter>
        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          variant={"secondary"}
          onClick={() => router.push(`/post/${id}`)}
        >
          View more
        </Button>
      </CardFooter>
    </Card>
  );
}
