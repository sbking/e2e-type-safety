import { format } from "date-fns";
import type { NextPage } from "next";
import Link from "next/link";

import { Loading } from "../../components/Loading";
import { trpc } from "../../lib/trpc";

const Blog: NextPage = () => {
  const posts = trpc.posts.list.useQuery().data;

  if (!posts) {
    return <Loading />;
  }

  return (
    <main className="container my-12 grid grid-cols-1 gap-6 px-6 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`}>
          <a className="group block lg:first:col-span-2 xl:first:col-span-3">
            <article className="overflow-hidden rounded-lg bg-white shadow transition hover:scale-[1.01] hover:shadow-lg md:flex md:group-first:block md:group-first:h-auto lg:block lg:h-auto">
              <aside className="h-40 flex-none md:h-full md:w-80 md:group-first:h-60 md:group-first:w-full lg:h-40 lg:w-full">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </aside>
              <div className="flex-auto overflow-hidden px-6 pb-5 md:group-first:pb-6">
                <h1 className="mt-6 truncate font-serif text-3xl text-zinc-800 group-hover:underline md:group-first:text-5xl md:group-first:leading-normal">
                  {post.title}
                </h1>
                <time
                  dateTime={post.createdAt.toISOString()}
                  className="text-xs font-semibold uppercase text-teal-500 md:group-first:text-sm"
                >
                  {format(post.createdAt, "PPP")}
                </time>
                <p className="text-zinc-700 line-clamp-3 md:group-first:text-xl">
                  {post.body.split("\n")[0]}
                </p>
                <span className="text-xs uppercase text-teal-500 group-hover:underline md:group-first:text-sm">
                  Read more &gt;
                </span>
              </div>
            </article>
          </a>
        </Link>
      ))}
    </main>
  );
};

export default Blog;
