import { cn } from '@/lib/utils';
import PostSummary from '../_components/PostSummary';
import { getPagesParams, getPostsByPage } from '@/lib/blog';
import GeneralLayout from '@/layouts/GeneralLayout';
import BlogPagination from '../_components/BlogPagination';

export async function generateStaticParams() {
  return getPagesParams();
}

export default async function Page(
  {
    params: {
      page
    }
  }: {
    params: {
      page: string
    }
  },
) {
  const posts = getPostsByPage(parseInt(page));

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
          className="grid gap-8 md:grid-cols-2"
        >
          {posts.map((post) => (
            <PostSummary 
              className="w-full max-w-screen-sm"
              key={post.id}
              postMeta={post}
            />
          ))}
        </div>

        <BlogPagination 
          page={parseInt(page)}
        />
      </section>
    </GeneralLayout>
  );
}