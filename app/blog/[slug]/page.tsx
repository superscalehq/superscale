import { allPosts, type Post } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer/hooks';
import { notFound } from 'next/navigation';

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
  const Content = getMDXComponent(post.body.code);

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="px-4 py-6 md:px-6 md:py-12 lg:py-16">
        <article className="prose prose-zinc dark:prose-invert mx-auto max-w-6xl">
          <div className="not-prose space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Taxing Laughter: The Joke Tax Chronicles
            </h1>
            <div className="flex items-center text-zinc-500 dark:text-zinc-400">
              <img
                alt="Author avatar"
                className="mr-2 rounded-full"
                height="40"
                src="/placeholder.svg"
                style={{
                  aspectRatio: '40/40',
                  objectFit: 'cover',
                }}
                width="40"
              />
              <span>By Author Name</span>
              <span className="mx-2">|</span>
              <span>Posted on October 31, 2023</span>
              <span className="mx-2">|</span>
              <span>Time to read: 5 minutes</span>
            </div>
          </div>
          <Content />
        </article>
      </div>
    </div>
  );
}
