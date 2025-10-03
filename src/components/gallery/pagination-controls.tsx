
"use client"; 

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { FC } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  searchParams,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
				className="cursor-pointer"
      >
        Previous
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => router.push(createPageURL(page))}
            className={currentPage === page ? "bg-black text-white" : "cursor-pointer"}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
				className="cursor-pointer"
      >
        Next
      </Button>
    </div>
  );
};
