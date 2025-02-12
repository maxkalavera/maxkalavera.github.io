import { PostData } from "@/types/blog";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import moment from "moment";
import Markdown from "@/components/Markdown";


const PostSummary = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<React.ElementType> & {
    postMeta: PostData
  }
>((
  {
    postMeta,
    ...props
  }, 
  forwardedRef
) => {
  return (
    <article 
      {...props}
      ref={forwardedRef}
      className={cn(
        props.className,
        "w-full h-fit p-6 overflow-hidden",
        "flex flex-col justify-start items-stretch gap-4",
        "rounded-md bg-background dark:bg-primary-500/5",
        "border-solid border-[1px] border-gray-200 dark:border-primary-800/20",
        "shadow-sm",
      )}
    >
      <div
        data-testid='post-summary-header'
        className="flex justify-between items-center text-sm text-gray-500"
      >
        <div
          className=" flex flex-row justify-start items-center gap-2"
        >
          {postMeta.tags && postMeta.tags.map((tag: string, index: number) => (
            <span
              key={index}
              data-testid="tags"
              className={cn(
                "rounded border-solid border-[1px] border-gray-500",
                "text-gray-700 dark:text-gray-300 text-xs font-medium",
                "inline-flex flex-row items-center px-2.5 py-0.5",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className=" flex flex-row justify-start items-center gap-2"
        >
          {postMeta.date && (
            <span
              className="text-sm"
            >
              {moment(postMeta.date).calendar({
                    sameDay: '[Today]',
                    nextDay: '[Tomorrow]',
                    nextWeek: 'dddd',
                    lastDay: '[Yesterday]',
                    lastWeek: '[Last] dddd',
                    sameElse: 'DD/MM/YYYY'
              })}
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/blog/post/${postMeta.id}`}
      >
        <h2 
          className="w-fill text-left text-xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            {postMeta.title || 'Untitled'}
        </h2>
      </Link>

      <Markdown
        data-testid="summary"
        className="w-full min-h-0 flex-grow flex-shrink overflow-hidden"
      >
        {postMeta.excerpt || ''}
      </Markdown>

      <div
        data-testid="footer"
        className="flex justify-between items-center"
      >
          <div
            data-testid="author"
            className="flex flex-row justify-start items-end  gap-2 flex-wrap"
          >
            {/* // TODO: Include author's image
              <Image
                className="w-6 h-6 rounded-full" 
                src={profilePicture}
                alt="Post author's avatar"
              />
            */}
            <span className="text-sm text-left text-wrap font-serif font-medium dark:text-white align-center">
                Max Hernandez
            </span>
          </div>
          <Link
            className="inline-flex items-center text-sm md:text-md font-serif font-medium text-primary-600 dark:text-primary-500 hover:underline" 
            href={`/blog/post/${postMeta.id}`}
          >
                        Read more
            <ArrowRight 
              className="ml-2 w-4 h-4"
            />
          </Link>
      </div>
  </article> 
  )
});

PostSummary.displayName = 'PostSummary';

export default PostSummary