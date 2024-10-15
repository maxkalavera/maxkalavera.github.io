import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { globSync } from 'glob';
import { PostData } from '@/types/blog';

type PostPath = string;

const PAGINATION_PAGE_SIZE = 20;
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
    } as PostData;
  });

  return allPostsData
    .filter((item) => !(item.draft || false))
    .sort((a, b) => {
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

export function countPosts () {
  return collectPosts().length;
}

export function countPages () {
  const numberPosts = countPosts();
  return Math.ceil(numberPosts / PAGINATION_PAGE_SIZE);
}

export function getPagesParams () {
  const numberPosts = countPosts();
  return Array(Math.ceil(numberPosts / PAGINATION_PAGE_SIZE))
    .fill(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map((_, index) => ({ page: (index + 1).toString() }))
}

export function getPostsByPage (page: number): PostData[] {
  const allPostsData = collectPosts();
  return allPostsData.slice(
    (page - 1) * PAGINATION_PAGE_SIZE,
    (page) * PAGINATION_PAGE_SIZE
  );
}