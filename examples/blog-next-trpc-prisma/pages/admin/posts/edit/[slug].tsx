import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";

import { DeleteCommentButton } from "../../../../components/DeleteCommentButton";
import { DeletePostButton } from "../../../../components/DeletePostButton";
import { Loading } from "../../../../components/Loading";
import { PostForm } from "../../../../components/PostForm";
import { trpc } from "../../../../lib/trpc";

export default function PostAdmin() {
  const slug = useRouter().query.slug as string;

  const post = trpc.posts.getMarkdown.useQuery(
    { slug },
    { enabled: typeof slug === "string" }
  ).data;

  if (!post) {
    return <Loading />;
  }

  return (
    <main
      className="container w-full text-left sm:my-6 sm:px-6"
      key={post.slug}
    >
      <div className="m-6 flex items-baseline justify-between sm:mx-0">
        <h1 className="mr-4 inline-block text-xl font-semibold sm:text-4xl">
          Edit Post
        </h1>
        <Link href={`/blog/${post.slug}`}>
          <a className="mr-auto text-sky-500 hover:underline">View post</a>
        </Link>
        <DeletePostButton slug={post.slug} />
      </div>
      <div className="rounded-lg bg-white py-8 px-6 shadow">
        <PostForm post={post} />

        <div className="my-8">
          <h2 className="mb-4 text-xl font-semibold">
            Comments ({post.comments.length})
          </h2>
          {post.comments.length > 0 && (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-zinc-300 font-semibold">
                <tr>
                  <th className="rounded-tl-lg py-3 px-4">Comment</th>
                  <th className="rounded-tr-lg py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {post.comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-x border-b border-zinc-300"
                  >
                    <td className="py-3 px-4">
                      <p className="mr-2 mb-2 inline-block font-semibold">
                        {comment.by}
                      </p>
                      <time
                        dateTime={comment.createdAt.toISOString()}
                        className="text-zinc-500"
                      >
                        {format(comment.createdAt, "PPP")}
                      </time>
                      <p>{comment.text}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DeleteCommentButton
                        postSlug={post.slug}
                        commentId={comment.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
