import { Image } from '@/components/ui/image';
import {
  allAuthors,
  allPosts,
  Author,
  type Post,
} from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allPosts.find((post) => post.slug === params.slug) as Post;
  if (!post) {
    notFound();
  }
  const author = allAuthors.find(
    (author) => author.slug === post.author
  ) as Author;
  const Content = getMDXComponent(post.body.code);

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="px-4 py-6 md:px-6 md:py-12 lg:py-16">
        <article className="prose prose-zinc dark:prose-invert mx-auto max-w-4xl">
          <div className="not-prose mb-6 space-y-2">
            <h1 className="mb-1 text-4xl font-extrabold tracking-tight md:mb-4 lg:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center text-zinc-500 dark:text-zinc-400">
              <img
                alt={author.name}
                className="mr-2 rounded-full"
                height="40"
                src={author.avatar}
                style={{
                  aspectRatio: '40/40',
                  objectFit: 'cover',
                }}
                width="40"
              />
              <span>By {author.name}</span>
              <span className="mx-2">|</span>
              <span>
                Posted on {format(parseISO(post.createdAt), 'do MMMM yyyy')}
              </span>
              <span className="mx-2">|</span>
              <span>Time to read: ~ {post.readingTime} minutes</span>
            </div>
          </div>
          <Content components={{ Image }} />
        </article>
      </div>
    </div>
  );
}
