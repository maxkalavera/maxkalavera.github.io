import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { globSync } from 'glob';
import { PostMeta } from '@/types/blog';

type PostPath = string;

const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');

export function findPosts (): PostPath[] {
  return globSync(path.join(postsDirectory, "./**/*.md"));
}

export function collectPosts () {
  const paths = findPosts();
  const allPostsData = paths.map((postPath) => {
    const id = encodeURIComponent(path.basename(postPath).replace(/\.md$/, ''));
    const fileContents = fs.readFileSync(postPath, 'utf8');
    const matterResult = matter(
      fileContents,
      {
        excerpt_separator: '---'
      }
    );

    return {
      id,
      location: path.relative(postsDirectory, postPath),
      excerpt: matterResult.excerpt,
      content: matterResult.content,
      ...matterResult.data,
    } as PostMeta;
  });

  return allPostsData.sort((a, b) => {
    if ((a.date || a.id) < (b.date || b.id)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function collectPost (id: string) {
  const allPostsData = collectPosts();
  const data = allPostsData.filter((item) => item.id === id);
  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}