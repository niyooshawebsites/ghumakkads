"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationComp({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Build visible page numbers
  const pageNumbers: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    }
  }

  // Insert ellipsis where needed
  const items: (number | "ellipsis")[] = [];

  for (let i = 0; i < pageNumbers.length; i++) {
    if (i > 0 && pageNumbers[i] - pageNumbers[i - 1] > 1) {
      items.push("ellipsis");
    }

    items.push(pageNumbers[i]);
  }

  return (
    <Pagination className="inline-block">
      <PaginationContent>
        {/* Previous */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          </PaginationItem>
        )}

        <span className="px-2 text-sm">Page</span>

        {/* Page Numbers */}
        {items.map((item, index) => (
          <PaginationItem key={index}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(item)}
                isActive={item === currentPage}
              >
                {item < 10 ? `0${item}` : item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <span className="px-2 text-sm">
          of {totalPages < 10 ? `0${totalPages}` : totalPages} Pages
        </span>

        {/* Next */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageURL(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
