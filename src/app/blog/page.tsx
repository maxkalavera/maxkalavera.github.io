import { cn } from '@/lib/utils';
import PostSummary from './_components/PostSummary';
import { getPostsByPage } from '@/lib/blog';
import GeneralLayout from '@/layouts/GeneralLayout';
import BlogPagination from './_components/BlogPagination';

export default async function BlogPage() {
  const posts = getPostsByPage(1);

  return (
    <GeneralLayout>
      <section 
        className={cn(
          "p-4 md:p-8 w-full min-h-content max-w-screen-lg",
          "flex flex-col justify-start items-center gap-8",
        )}
      >
        <h1
          className={cn(
            "text-4xl text-foreground font-sans"
          )}
        >
          Max Hernandez&apos;s Blog
        </h1>
        <div
          className={cn(
            "w-full grid gap-8 md:grid-cols-2 content-center place-content-center items-center place-items-center"
          )}
        >
          {posts.slice(0, 1).map((post) => (
            <PostSummary 
              className="w-full max-w-screen-sm col-span-2"
              key={post.id}
              postMeta={post}
            />
          ))}
          {posts.slice(1, -1).map((post) => (
            <PostSummary 
              className="w-full max-w-screen-sm"
              key={post.id}
              postMeta={post}
            />
          ))}
        </div>

        <BlogPagination 
          page={1}
        />
      </section>
    </GeneralLayout>
  );
}
