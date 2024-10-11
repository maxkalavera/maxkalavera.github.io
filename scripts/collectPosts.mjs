import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

const publicDirectory = path.join(process.cwd(), 'public');
const postsDirectory = path.join(publicDirectory, 'content/posts');
const assetsDirectory = path.join(process.cwd(), 'src/assets');
const indexFilename = 'posts-index.json';

export function getSortedPostsData() {
  const paths = globSync(path.join(postsDirectory, "./**/*.md"));
  const allPostsData = paths.map((_path) => {
    const id = path.basename(_path).replace(/\.md$/, '');
    const fileContents = fs.readFileSync(_path, 'utf8');
    const matterResult = matter(
      fileContents,
      {
        excerpt_separator: '---'
      }
    );

    return {
      id,
      location: path.relative(publicDirectory, _path),
      excerpt: matterResult.excerpt,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  const sortedPostsData = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  // Write index of posts into posts directory
  const indexPath = path.join(assetsDirectory, indexFilename);
  fs.writeFileSync(
    indexPath,
    JSON.stringify(sortedPostsData)
  );

  console.info(`Generated posts index into ${indexPath}`)
}

getSortedPostsData();