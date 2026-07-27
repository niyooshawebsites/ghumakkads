"use server";

import DOMPurify from "isomorphic-dompurify";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

interface ActionState {
  success: boolean;
  msg: string;
  data?: [];
  pagination?: PaginationMeta;
}

// fetching all the posts
export async function fetchAllPosts(
  page: number = 1,
  pageSize: number = 10,
  userId: string,
) {
  try {
    let posts;
    let totalPosts;

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        msg: "Unauthorized",
        data: [],
        pagination: {
          page: 1,
          pageSize,
          totalPosts: 0,
          totalPages: 1,
        },
      };
    }
    const isAdmin = session.user.role === 1;

    if (isAdmin) {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      totalPosts = await prisma.post.count();
    } else {
      posts = await prisma.post.findMany({
        where: {
          authorId: userId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      totalPosts = await prisma.post.count({
        where: {
          authorId: userId,
        },
      });
    }

    return {
      success: true,
      msg: "Successfully fetched posts",
      data: posts,
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize) || 1,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch posts",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }
}

// fetching published posts
export async function fetchPusblishedPosts({ page = 1, pageSize = 10 }) {
  let totalPosts;
  let publisedPosts;

  try {
    publisedPosts = await prisma.post.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    totalPosts = await prisma.post.count({
      where: {
        published: true,
      },
    });

    return {
      success: true,
      msg: "Fetched all published posts successfully",
      data: publisedPosts,
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize) || 1,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetched published posts",
      data: [],
      pagination: {
        page,
        pageSize,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }
}

// creating posts
export async function createPost(prevState: ActionState, formData: FormData) {
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const galleryImages = JSON.parse(
    (formData.get("galleryImages") as string) || "[]",
  );
  const content = DOMPurify.sanitize(
    (formData.get("content") as string)?.trim(),
  );
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  if (!title || !content || !imageUrl) {
    return {
      success: false,
      msg: "Please fill out all the fields",
    };
  }
  try {
    // create the post
    await prisma.post.create({
      data: {
        categoryId,
        title,
        content,
        imageUrl,
        authorId: session.user.id,
        images: {
          create: galleryImages.map((img: string) => ({
            imageUrl: img,
          })),
        },
      },
    });

    return {
      success: true,
      msg: "Post created successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to create post",
    };
  }
}

// toggling publishing posts
export async function togglePostStatus(postId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  const isAdmin = session.user.role === 1;

  if (!isAdmin) {
    return {
      success: false,
      msg: "Unauthorized.Not admin",
    };
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return {
        success: false,
        msg: "No post found",
      };
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        published: !post.published,
      },
    });

    return {
      success: true,
      msg: post.published
        ? "Post unpublished successfully"
        : "Post published successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to publish post",
    };
  }
}

// delete post
export async function deletePost(postId: string) {
  const session = await auth();

  if (session?.user.role !== 1) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  try {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/dashboard/posts");

    return {
      success: true,
      msg: "Post deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to delete post",
    };
  }
}

// delete posts
export async function deletePosts(ids: string[]) {
  const session = await auth();

  if (session?.user.role !== 1) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  try {
    await prisma.post.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath("/dashboard/posts");

    return {
      success: true,
      msg: "Post deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to delete posts",
    };
  }
}

// edit the posts
export async function editPost(
  postId: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const session = await auth();

  if (!session?.user.id) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  if (!title || !content || !imageUrl) {
    return {
      success: false,
      msg: "Please fill out all the fields",
    };
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return {
        success: false,
        msg: "No post found",
      };
    }

    if (post.authorId !== session.user.id) {
      return {
        success: false,
        msg: "You are not authorized to edit this post",
      };
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        imageUrl,
        content,
      },
    });

    return {
      success: true,
      msg: "Post updated successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to edit post",
    };
  }
}

// find an post
export async function findPost(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        images: true,
      },
    });

    if (!post) {
      return {
        success: false,
        msg: "No post found",
      };
    }

    return {
      success: true,
      msg: "Post found successfully",
      data: post,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to edit post",
      data: null,
    };
  }
}

// searching an post
export async function searchDashboardPost(
  post_details: string,
  page: number = 1,
  pageSize: number = 10,
  userId: string,
) {
  try {
    let posts;
    let totalPosts;

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        msg: "Unauthorized",
        data: [],
        pagination: {
          page: 1,
          pageSize,
          totalPosts: 0,
          totalPages: 1,
        },
      };
    }

    const isAdmin = session.user.role === 1;

    if (isAdmin) {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        where: {
          title: {
            contains: post_details,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPosts = await prisma.post.count({
        where: {
          title: {
            contains: post_details,
            mode: "insensitive",
          },
        },
      });

      if (totalPosts === 0) {
        return {
          success: true,
          msg: "No posts found",
          data: [],
          pagination: {
            page: 1,
            pageSize,
            totalPosts: 0,
            totalPages: 1,
          },
        };
      }

      return {
        success: true,
        msg: "Successfully fetched posts",
        data: posts,
        pagination: {
          page,
          pageSize,
          totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize) || 1,
        },
      };
    } else {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        where: {
          authorId: userId,
          title: {
            contains: post_details,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPosts = await prisma.post.count({
        where: {
          authorId: userId,
          title: {
            contains: post_details,
            mode: "insensitive",
          },
        },
      });

      if (totalPosts === 0) {
        return {
          success: true,
          msg: "No posts found",
          data: [],
          pagination: {
            page: 1,
            pageSize,
            totalPosts: 0,
            totalPages: 1,
          },
        };
      }

      return {
        success: true,
        msg: "Successfully fetched posts",
        data: posts,
        pagination: {
          page,
          pageSize,
          totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize) || 1,
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "No post found",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }
}

// filter post by category
export async function filterPostsByCatetoryForDashboard(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  userId: string,
) {
  let posts;
  let totalPosts;
  const session = await auth();

  if (!session?.user.id) {
    return {
      success: true,
      msg: "Aunthorized",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 0,
      },
    };
  }

  const isAdmin = session.user.role === 1;

  try {
    if (isAdmin) {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        where: {
          categoryId,
        },
      });

      if (posts.length == 0) {
        return {
          success: true,
          msg: "No posts found",
          data: [],
          pagination: {
            page: 1,
            pageSize,
            totalPosts: 0,
            totalPages: 0,
          },
        };
      }

      totalPosts = await prisma.post.count({
        where: {
          categoryId,
        },
      });

      return {
        success: true,
        msg: "Posts fetched succesfully",
        data: posts,
        pagination: {
          page,
          pageSize,
          totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize) || 1,
        },
      };
    } else {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        where: {
          categoryId,
          authorId: userId,
        },
      });

      if (posts.length == 0) {
        return {
          success: true,
          msg: "No posts found",
          data: [],
          pagination: {
            page: 1,
            pageSize,
            totalPosts: 0,
            totalPages: 0,
          },
        };
      }

      totalPosts = await prisma.post.count({
        where: {
          categoryId,
        },
      });

      return {
        success: true,
        msg: "Successfully fetched posts",
        data: posts,
        pagination: {
          page,
          pageSize,
          totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize) || 1,
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch posts",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 0,
      },
    };
  }
}

// filter posts by catetory and search term for dashboard
export async function fitlerPostsByCategoryAndSearchTermForDashboard(
  categoryId: string,
  post_details: string,
  page: number = 1,
  pageSize: number = 10,
  userId: string,
) {
  let posts;
  let totalPosts;
  const session = await auth();

  if (!session?.user.id) {
    return {
      success: true,
      msg: "Aunthorized",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 0,
      },
    };
  }

  const isAdmin = session.user.role === 1;

  try {
    if (isAdmin) {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        where: {
          AND: [{ categoryId }, { title: post_details }],
        },
      });

      if (posts.length == 0) {
        return {
          success: true,
          msg: "No posts found",
          data: [],
          pagination: {
            page: 1,
            pageSize,
            totalPosts: 0,
            totalPages: 0,
          },
        };
      }

      totalPosts = await prisma.post.count({
        where: {
          AND: [{ categoryId }, { title: post_details }],
        },
      });

      return {
        success: true,
        msg: "Posts fetched succesfully",
        data: posts,
        pagination: {
          page,
          pageSize,
          totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize) || 1,
        },
      };
    } else {
      posts = await prisma.post.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              authorId: true,
              postId: true,
            },
          },
        },
        where: {
          categoryId,
          title: post_details,
          authorId: userId,
        },
      });

      if (posts.length == 0) {
        return {
          success: true,
          msg: "No posts found",
          data: [],
          pagination: {
            page: 1,
            pageSize,
            totalPosts: 0,
            totalPages: 0,
          },
        };
      }

      totalPosts = await prisma.post.count({
        where: {
          categoryId,
          title: post_details,
          authorId: userId,
        },
      });

      return {
        success: true,
        msg: "Successfully fetched posts",
        data: posts,
        pagination: {
          page,
          pageSize,
          totalPosts,
          totalPages: Math.ceil(totalPosts / pageSize) || 1,
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch posts",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 0,
      },
    };
  }
}

// fetch posts by category for website
export async function fetchPostsByCatetoryForWebsite(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  let posts;
  let totalPosts;

  try {
    posts = await prisma.post.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        categoryId,
        published: true,
      },
    });

    if (posts.length == 0) {
      return {
        success: true,
        msg: "No posts found",
        data: [],
        pagination: {
          page: 1,
          pageSize,
          totalPosts: 0,
          totalPages: 0,
        },
      };
    }

    totalPosts = await prisma.post.count({
      where: {
        categoryId,
      },
    });

    return {
      success: true,
      msg: "Posts fetched succesfully",
      data: posts,
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize) || 1,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch posts",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalPosts: 0,
        totalPages: 0,
      },
    };
  }
}

// fetch posts by post search for website
export async function fetchPostsBySearchTermForWebsite({
  q,
  by,
  page = 1,
}: {
  q?: string;
  by?: string;
  page?: number;
}) {
  const pageSize = 10;

  if (!q || !by) {
    return {
      success: false,
      msg: "Please fill out all the details",
      data: [],
      pagination: {
        page,
        pageSize,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }

  try {
    const where: Prisma.PostWhereInput =
      by === "post"
        ? {
            title: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {
            author: {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
          };

    const posts = await prisma.post.findMany({
      where,
      include: {
        category: true,
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPosts = await prisma.post.count({ where });

    return {
      success: true,
      msg: "Posts fetched successfully",
      data: posts,
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch the posts",
      data: [],
      pagination: {
        page,
        pageSize,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }
}

// fetch all posts for a user for dashboard
export async function fetchAllPublishedPostsOfAUserForWebsite(
  user_details: string,
) {}

// fetching all posts of a particular user for dashboard
export async function fetchAllPostsOfAUserForDashboard(
  user_details: string,
  page: number,
  pageSize = 10,
) {
  const session = await auth();
  const admin = session?.user.role === 1;

  if (!admin) {
    return {
      success: false,
      msg: "Unauthorized action",
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }

  try {
    const posts = await prisma.post.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            authorId: true,
            postId: true,
          },
        },
      },
      where: {
        author: {
          name: {
            equals: user_details,
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (posts.length == 0) {
      return {
        success: true,
        msg: "No post found",
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalPosts: 0,
          totalPages: 1,
        },
      };
    }

    const totalPosts = await prisma.post.count({
      where: {
        author: {
          name: user_details,
        },
      },
    });

    return {
      success: true,
      msg: "Posts fetched successfully",
      data: posts,
      pagination: {
        page,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch posts",
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }
}
