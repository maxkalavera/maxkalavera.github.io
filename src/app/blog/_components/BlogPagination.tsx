import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { countPages } from "@/lib/blog";

const maxPages = countPages();

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {
  page: number,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BlogPagination = React.forwardRef<HTMLDivElement, Props>((
  {
    page,
    ...props
  }, 
  forwardedRef
) => {
  return (
    <Pagination
      {...props}
      ref={forwardedRef}
    >
      <PaginationContent>
        {page - 1 > 0 && (
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              href={`/blog/${page - 1}`}
            />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink 
            href={`/blog/${page}`}
            isActive={true}
          >
            {`${page}`}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        {page + 1 <= maxPages && (
          <>
            <PaginationItem>
              <PaginationLink href={`/blog/${page + 1}`}>
              {`${page + 1}`}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`/blog/${page + 1}`} />
            </PaginationItem>
          </>

        )}
      </PaginationContent>
    </Pagination>
  )
});

BlogPagination.displayName = 'BlogPagination';

export default BlogPagination