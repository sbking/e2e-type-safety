import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";

import { listPosts } from "~/models/posts.server";

export async function loader() {
  const posts = await listPosts();
  return json({ posts });
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <main className="container my-12 grid grid-cols-1 gap-6 px-6 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          to={post.slug}
          className="group block lg:first:col-span-2 xl:first:col-span-3"
        >
          <article className="overflow-hidden rounded-lg bg-white shadow transition hover:scale-[1.01] hover:shadow-lg md:flex md:group-first:block md:group-first:h-auto lg:block lg:h-auto">
            <aside className="h-40 flex-none md:h-full md:w-80 md:group-first:h-60 md:group-first:w-full lg:h-40 lg:w-full">
              <img
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </aside>
            <div className="flex-auto overflow-hidden px-6 pb-5 md:group-first:pb-6">
              <h1 className="mt-6 truncate font-serif text-3xl text-stone-800 group-hover:underline md:group-first:text-5xl md:group-first:leading-normal">
                {post.title}
              </h1>
              <time
                dateTime={post.createdAt}
                className="text-xs font-semibold uppercase text-red-500 md:group-first:text-sm"
              >
                {format(parseISO(post.createdAt), "PPP")}
              </time>
              <p className="text-stone-700 line-clamp-3 md:group-first:text-xl">
                {post.body.split("\n")[0]}
              </p>
              <span className="text-xs uppercase text-red-500 group-hover:underline md:group-first:text-sm">
                Read more &gt;
              </span>
            </div>
          </article>
        </Link>
      ))}
    </main>
  );
}
