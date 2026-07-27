"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Category } from "@/lib/generated/prisma/client";
import slugify from "slugify";

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

interface ActionState {
  success: boolean;
  msg: string;
  category?: Category;
  data?: [];
  pagination?: PaginationMeta;
}

// creating category
export async function CreateCategory(
  prevState: ActionState,
  formData: FormData,
) {
  const name = (formData.get("name") as string)?.trim();
  const session = await auth();

  if (!name) {
    return {
      success: false,
      msg: "Please fill out the details",
    };
  }

  if (session?.user.role !== 1) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        msg: "Category already exists",
      };
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name, {
          lower: true,
          strict: true,
        }),
      },
    });

    return {
      success: true,
      msg: "Category created successfully",
      category,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to create category",
    };
  }
}

// fetch all categories - used on create post page
export async function fetchAllCategories() {
  try {
    const categories = await prisma.category.findMany();

    return {
      success: true,
      msg: "Fetched all categories successfully",
      data: categories,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch categories",
      data: [],
    };
  }
}

// fetching all categories for category table
export async function fetchCategoriesForDashboard({ page = 1, pageSize = 10 }) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (categories.length == 0) {
      return {
        success: true,
        msg: "No category found",
        data: [],
        pagination: {
          page: 1,
          pageSize,
          totalCategories: 0,
          totalPosts: 0,
          totalPages: 1,
        },
      };
    }

    const totalCategories = await prisma.user.count();

    return {
      success: true,
      msg: "Categories fetched successfully",
      data: categories,
      pagination: {
        page,
        pageSize,
        totalCategories,
        totalPages: Math.ceil(totalCategories / pageSize) || 1,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch all categories",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalCategories: 0,
        totalPosts: 0,
        totalPages: 1,
      },
    };
  }
}

// delete category
export async function deleteCategory(id: string) {
  if (!id) {
    return {
      success: false,
      msg: "Invalid category id",
    };
  }
  const session = await auth();

  if (session?.user.role !== 1) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      msg: "Category deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to delete the category",
    };
  }
}

// delete categories
export async function deleteCategories(ids: string[]) {
  if (!ids) {
    return {
      success: false,
      msg: "Invalid category id",
    };
  }

  const session = await auth();

  if (session?.user.role !== 1) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }
  try {
    await prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      msg: "Categories deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to delete categories",
    };
  }
}

// edit category
export async function editCategory(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!id) {
    return {
      success: false,
      msg: "Invalid category id",
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const session = await auth();
  if (!name) {
    return {
      success: false,
      msg: "Please fill out the category",
    };
  }

  if (session?.user.role !== 1) {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }

  try {
    await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        slug: slugify(name, {
          lower: true,
          strict: true,
        }),
      },
    });

    return {
      success: true,
      msg: "Category updated successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to update the category",
    };
  }
}

// fetch category for edit for dashboard
export async function fetchCategoryForEditForDashboard(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return {
        success: true,
        msg: "No such catetory exists",
        data: null,
      };
    }

    return {
      success: true,
      msg: "Category fetched successfully",
      data: category,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      msg: "Failed to fetch category",
      data: null,
    };
  }
}

// search a category for the dashboard
export async function searchCategoryForDashboard(name: string) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    if (categories.length === 0) {
      return {
        success: true,
        msg: "No category found",
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCategories: 0,
          totalPages: 1,
        },
      };
    }

    const totalCategories = await prisma.category.count({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    return {
      success: true,
      msg: "Categories fetched successfully",
      data: categories,
      pagination: {
        page: 1,
        pageSize: 10,
        totalCategories,
        totalPages: 1,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      msg: "Failed to search the category",
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCategories: 0,
        totalPages: 1,
      },
    };
  }
}
