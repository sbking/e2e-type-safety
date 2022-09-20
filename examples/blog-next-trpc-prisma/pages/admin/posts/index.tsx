import { format } from "date-fns";
import Link from "next/link";

import { Loading } from "../../../components/Loading";
import { trpc } from "../../../lib/trpc";

export default function Blog() {
  const posts = trpc.posts.table.useQuery().data;

  if (!posts) {
    return <Loading />;
  }

  return (
    <main className="container w-full text-left sm:my-12 sm:px-6">
      <header className="m-6 flex items-center justify-between sm:mx-0 sm:mt-0">
        <h1 className="inline-block text-xl font-semibold sm:text-4xl">
          Posts
        </h1>

        <Link href="/admin/posts/new">
          <a className="ml-4 inline-flex h-8 items-center whitespace-nowrap rounded-full bg-sky-500 px-4 text-sm font-semibold text-white transition hover:bg-sky-600 active:bg-sky-700 disabled:cursor-not-allowed sm:h-10 sm:text-base">
            New Post
          </a>
        </Link>
      </header>
      <table className="w-full border-collapse bg-white shadow">
        <thead className="bg-zinc-300 font-semibold">
          <tr>
            <th className="py-3 px-4 sm:rounded-tl-lg">Post</th>
            <th className="hidden py-3 px-4 text-right sm:table-cell">
              Comments
            </th>
            <th className="py-3 px-4 text-right sm:rounded-tr-lg">
              Created at
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.slug}
              className="border-b border-zinc-300 last:border-b-0"
            >
              <th className="py-3 px-4 text-sm md:text-base">
                <Link key={post.slug} href={`/admin/posts/edit/${post.slug}`}>
                  <a className="hover:underline">{post.title}</a>
                </Link>
              </th>
              <td className="hidden py-3 px-4 text-right sm:table-cell">
                {post._count.comments}
              </td>
              <td className="whitespace-nowrap py-3 px-4 text-right text-sm">
                {format(post.createdAt, "PPP")}
                <br />
                <span className="text-zinc-400">
                  {format(post.createdAt, "pp")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
