"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalUsers: number;
  totalPages: number;
}

const defaultPagination = <PaginationProps>{
  page: 1,
  pageSize: 10,
  totalUsers: 0,
  totalPages: 1,
};

// fitler by user details
export async function filterUsersByUserDetailsForDashboard(
  user_details: string,
  page = 1,
) {
  const session = await auth();
  const admin = session?.user.role === 1;

  if (!admin) {
    return {
      success: false,
      msg: "Unauthorized action",
      data: [],
      pagination: <PaginationProps>defaultPagination,
    };
  }

  const pageSize = 10;

  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
      where: {
        OR: [
          {
            email: {
              equals: user_details,
              mode: "insensitive",
            },
          },
          {
            name: {
              equals: user_details,
              mode: "insensitive",
            },
          },
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (users.length == 0) {
      return {
        success: true,
        msg: "No users found",
        data: [],
        pagination: <PaginationProps>defaultPagination,
      };
    }

    const totalUsers = await prisma.user.count({
      where: {
        email: user_details,
      },
    });

    return {
      success: true,
      msg: "Users fetched successfully",
      data: users,
      pagination: {
        page,
        pageSize,
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch user details",
      data: [],
      pagination: <PaginationProps>defaultPagination,
    };
  }
}

// fetch all the users
export async function fetchUsers(page = 1, pageSize = 10) {
  const session = await auth();

  const admin = session?.user.role === 1;

  if (!admin) {
    return {
      success: false,
      msg: "Unauthorized Action",
      data: [],
      pagination: <PaginationProps>defaultPagination,
    };
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
      where: {
        role: {
          not: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize, // take is same as mongodb limit(10)
    });

    const totalUsers = await prisma.user.count({
      where: {
        role: {
          not: 1,
        },
      },
    });

    return {
      success: true,
      msg: "Users fetched successfully",
      data: users,
      pagination: <PaginationProps>{
        page,
        pageSize,
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch users",
      data: [],
      pagination: <PaginationProps>defaultPagination,
    };
  }
}

// delete a user
export async function deleteUser(userId: string) {
  const session = await auth();

  const admin = session?.user.role === 1;

  if (!admin) {
    return {
      success: false,
      msg: "Unauthorized Action",
    };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      msg: "User deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to delete user",
    };
  }
}

// delete users
export async function deleteUsers(userIds: string[]) {
  const session = await auth();
  const admin = session?.user.role === 1;

  if (!admin) {
    return {
      success: false,
      msg: "Unauthorized Action",
    };
  }

  try {
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      msg: "Users deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to delete users",
    };
  }
}
