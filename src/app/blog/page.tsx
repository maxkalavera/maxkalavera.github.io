import { cn } from '@/lib/utils';
import { PostMeta } from '@/types/blog';
import PostSummary from './_components/PostSummary';
import postsIndex from '@/assets/posts-index.json';

export async function getPosts(): Promise<PostMeta[]> {
  return postsIndex as unknown as PostMeta[];
}

export default async function BlogPage() {
  const allPostsData = await getPosts();

  return (
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
      {allPostsData.map((postMeta) => (
        <PostSummary 
          className="w-full max-w-screen-sm"
          key={postMeta.id}
          postMeta={postMeta}
        />
      ))}
    </div>
  </section>
  );
}