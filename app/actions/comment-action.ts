"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface ActionState {
  success: boolean;
  msg: string;
}

export async function createComment(
  postId: string,
  prevState: ActionState,
  formData: FormData,
) {
  const content = (formData.get("content") as string)?.trim();
  const session = await auth();

  if (!content) {
    return {
      success: false,
      msg: "Please fill out the details",
    };
  }

  if (!session) {
    return {
      success: false,
      msg: "Please login to comment",
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
    });

    return {
      success: true,
      msg: "Comment added successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to add comment",
    };
  }
}

// fetch all comments for website
export async function fetchAllComments(postId: string, page: number) {
  const pageSize = 10;

  if (!postId) {
    return {
      success: false,
      msg: "No post id. No comments",
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalComments: 0,
        totalPages: 1,
      },
    };
  }

  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        post: {
          select: {
            title: true,
          },
        },
      },
      where: {
        postId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (comments.length == 0) {
      return {
        success: true,
        msg: "No comments for this post",
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalComments: 0,
          totalPages: 1,
        },
      };
    }

    const totalComments = await prisma.comment.count({
      where: {
        postId,
      },
    });

    return {
      success: true,
      msg: "Comments fetched successfully",
      data: comments,
      pagination: {
        page,
        pageSize,
        totalComments,
        totalPages: Math.ceil(totalComments / pageSize),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch the comments",
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalComments: 0,
        totalPages: 1,
      },
    };
  }
}
