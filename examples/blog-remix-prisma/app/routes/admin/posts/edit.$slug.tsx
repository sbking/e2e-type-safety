import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import invariant from "tiny-invariant";

import {
  DeleteCommentButton,
  deleteCommentAction,
} from "~/components/DeleteCommentButton";
import {
  DeletePostButton,
  deletePostAction,
} from "~/components/DeletePostButton";
import { PostForm, postFormAction } from "~/components/PostForm";
import { loadPost } from "~/models/posts.server";

/** Loads the existing post data */
export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "Expected params.slug");
  const post = await loadPost(params.slug);
  return json({ post });
}

// Server actions on this page
const UPDATE_POST = "updatePost";
const DELETE_POST = "deletePost";
const DELETE_COMMENT = "deleteComment";

/** Handles server actions for this page */
export async function action({ params, request }: ActionArgs) {
  invariant(params.slug, "Expected params.slug");
  const formData = await request.formData();
  const action = formData.get("action");
  switch (action) {
    case UPDATE_POST:
      return postFormAction(params.slug, formData);
    case DELETE_POST:
      return deletePostAction(params.slug);
    case DELETE_COMMENT:
      return deleteCommentAction(params.slug, formData);
    default:
      throw json(`Unknown action: ${action}`, { status: 400 });
  }
}

export default function PostAdmin() {
  const { post } = useLoaderData<typeof loader>();

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
          to={`../blog/${post.slug}`}
          className="mr-auto text-sky-500 hover:underline"
        >
          View post
        </Link>
        <DeletePostButton action={DELETE_POST} />
      </div>
      <div className="rounded-lg bg-white py-8 px-6 shadow">
        <PostForm post={post} action={UPDATE_POST} />

        <div className="my-8">
          <h2 className="mb-4 text-xl font-semibold">
            Comments ({post.comments.length})
          </h2>
          {post.comments.length > 0 && (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-stone-300 font-semibold">
                <tr>
                  <th className="rounded-tl-lg py-3 px-4">Comment</th>
                  <th className="rounded-tr-lg py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {post.comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-x border-b border-stone-300"
                  >
                    <td className="py-3 px-4">
                      <p className="mr-2 mb-2 inline-block font-semibold">
                        {comment.by}
                      </p>
                      <time
                        dateTime={comment.createdAt}
                        className="text-stone-500"
                      >
                        {format(parseISO(comment.createdAt), "PPP")}
                      </time>
                      <p>{comment.text}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DeleteCommentButton
                        action={DELETE_COMMENT}
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
