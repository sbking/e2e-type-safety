import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

import { useAdminPostsQuery } from "../graphql/generated/schema";
import { Loading } from "../components/Loading";

export default function AdminPosts() {
  const { data } = useAdminPostsQuery();

  if (!data?.posts) {
    return <Loading />;
  }

  return (
    <main className="container w-full text-left sm:my-12 sm:px-6">
      <header className="m-6 flex items-center justify-between sm:mx-0 sm:mt-0">
        <h1 className="inline-block text-xl font-semibold sm:text-4xl">
          Posts
        </h1>

        <Link
          to="new"
          className="ml-4 inline-flex h-8 items-center whitespace-nowrap rounded-full bg-sky-500 px-4 text-sm font-semibold text-white transition hover:bg-sky-600 active:bg-sky-700 disabled:cursor-not-allowed sm:h-10 sm:text-base"
        >
          New Post
        </Link>
      </header>
      <table className="w-full border-collapse bg-white shadow">
        <thead className="bg-slate-300 font-semibold">
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
          {data.posts.map((post) => (
            <tr
              key={post.slug}
              className="border-b border-slate-300 last:border-b-0"
            >
              <th className="py-3 px-4 text-sm md:text-base">
                <Link
                  key={post.slug}
                  to={`edit/${post.slug}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </th>
              <td className="hidden py-3 px-4 text-right sm:table-cell">
                {post.commentCount}
              </td>
              <td className="whitespace-nowrap py-3 px-4 text-right text-sm">
                {format(parseISO(post.createdAt), "PPP")}
                <br />
                <span className="text-slate-400">
                  {format(parseISO(post.createdAt), "pp")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
