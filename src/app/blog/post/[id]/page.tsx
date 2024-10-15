import { cn } from '@/lib/utils';
import { collectPost, collectPosts } from '@/lib/blog';
import moment from "moment";
import Markdown from '@/components/Markdown';
import GeneralLayoutWithStickyHeader from '@/layouts/GeneralLayoutWithStickyHeader';

export async function generateStaticParams() {
  return collectPosts();
}

export default async function BlogPostPage(
  { 
    params 
  }: { 
    params: { id: string } 
  }
) {
  const post = collectPost(params.id);

  if (post === null) {
    return null;
  }

  return (
    <GeneralLayoutWithStickyHeader>
      <section 
        className={cn(
          "w-full p-4 sm:p-8",
          "dark:bg-primary-500/5",
          "flex flex-col justify-start items-center",
          "prose prose-gray dark:prose-invert prose-sm sm:prose-base"
        )}
      >
        <h1
          className="w-full text-xl md:text-4xl text-left"
        >
          {post?.title}
        </h1>

        <Markdown
          className="w-full"
        >
          {post?.content}
        </Markdown>

        <div
          className={cn(
            "w-full h-fit px-0 py-1 mt-6",
            "flex flex-row justify-between items-center gap-2"
          )}
        >
          <div
            className={cn(
              "flex flex-row justify-start items-center gap-2",
            )}
          >
            {post.tags && post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                data-testid="tags"
                className={cn(
                  "rounded border-solid border-[1px] border-gray-500",
                  "text-gray-700 dark:text-gray-300 text-xs font-medium",
                  "inline-flex flex-row items-center px-2 py-0.5",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
      
          {post?.date && (
            <>
              <span
                className="text-xs font-serif text-gray-700 dark:text-gray-300 font-bold"
              >
                {moment(post.date).calendar({
                      sameDay: '[Today]',
                      nextDay: '[Tomorrow]',
                      nextWeek: 'dddd',
                      lastDay: '[Yesterday]',
                      lastWeek: '[Last] dddd',
                      sameElse: 'DD/MM/YYYY'
                })}
              </span>
            </>
          )}
        </div>
      </section>
    </GeneralLayoutWithStickyHeader>
  );
}