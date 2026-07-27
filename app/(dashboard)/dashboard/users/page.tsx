import UserTable from "./user-table";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  filterUsersByUserDetailsForDashboard,
  fetchUsers,
} from "@/app/actions/user-actions";

interface Props {
  searchParams: Promise<{
    page?: string;
    user_details?: string;
  }>;
}

export default async function AllUsers({ searchParams }: Props) {
  const session = await auth();

  if (session?.user?.role == 0) {
    redirect("/dashboard");
  }

  let payload;
  let pagination;
  let count;

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const user_details = params.user_details;

  if (user_details && page) {
    const res = await filterUsersByUserDetailsForDashboard(user_details, page);
    payload = res.data;
    pagination = res.pagination;
    count = res.pagination?.totalUsers;
  } else {
    const res = await fetchUsers();
    payload = res.data;
    pagination = res.pagination;
    count = res.pagination?.totalUsers;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users {`(${count})`}</h1>
      <UserTable data={payload} pagination={pagination} currentPage={page} />
    </div>
  );
}
