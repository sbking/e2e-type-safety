import { format, parseISO } from "date-fns";
import { Link, useParams } from "react-router-dom";

import { DeleteCommentButton } from "../components/DeleteCommentButton";
import { DeletePostButton } from "../components/DeletePostButton";
import { Loading } from "../components/Loading";
import { PostForm } from "../components/PostForm";
import { useAdminEditPostQuery } from "../graphql/generated/schema";

export default function AdminEditPost() {
  const slug = useParams().slug as string;

  const { data } = useAdminEditPostQuery({ variables: { slug } });
  const post = data?.post;

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
        <Link
          to={`/blog/${post.slug}`}
          className="mr-auto text-sky-500 hover:underline"
        >
          View post
        </Link>
        <DeletePostButton slug={post.slug} />
      </div>
      <div className="rounded-lg bg-white py-8 px-6 shadow">
        <PostForm post={post} />

        <div className="my-8">
          <h2 className="mb-4 text-xl font-semibold">
            Comments ({post.comments?.length ?? 0})
          </h2>
          {post.comments && post.comments.length > 0 && (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-300 font-semibold">
                <tr>
                  <th className="rounded-tl-lg py-3 px-4">Comment</th>
                  <th className="rounded-tr-lg py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {post.comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-x border-b border-slate-300"
                  >
                    <td className="py-3 px-4">
                      <p className="mr-2 mb-2 inline-block font-semibold">
                        {comment.by}
                      </p>
                      <time
                        dateTime={comment.createdAt}
                        className="text-slate-500"
                      >
                        {format(parseISO(comment.createdAt), "PPP")}
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
