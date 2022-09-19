import { json, redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import type { MouseEventHandler } from "react";
import { useState } from "react";

import { deleteComment } from "~/models/comments.server";

/** Handles server action for deleting a comment */
export async function deleteCommentAction(slug: string, formData: FormData) {
  const commentId = formData.get("commentId");
  if (typeof commentId !== "string") {
    return json("Invalid commentId", { status: 400 });
  }

  try {
    await deleteComment(slug, commentId);
    return redirect(`/admin/posts/edit/${slug}`);
  } catch (error) {
    throw json("Not found", { status: 404 });
  }
}

/** Handles progressive enhancement for deleting a comment */
export function DeleteCommentButton(props: {
  action: string;
  commentId: string;
}) {
  const transition = useTransition();
  const deletingId =
    transition.submission?.formData.get("action") === props.action
      ? transition.submission?.formData.get("commentId")
      : null;
  const isDeleting = deletingId === props.commentId;

  const [isConfirming, setIsConfirming] = useState(false);
  const onClick: MouseEventHandler = (event) => {
    event.preventDefault();
    setIsConfirming(true);
  };

  return (
    <div className="sm:w-48 sm:whitespace-nowrap">
      <Form method="post" replace className="inline-block">
        <input type="hidden" name="commentId" value={props.commentId} />
        <button
          name="action"
          value={props.action}
          disabled={transition.state !== "idle"}
          onClick={isConfirming ? undefined : onClick}
          className="my-2 inline-flex h-8 items-center whitespace-nowrap rounded-full border-2 border-red-500 bg-white px-4 text-sm font-semibold text-red-500 transition hover:bg-red-100 active:bg-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-white disabled:text-red-300"
        >
          {isDeleting ? "Deleting..." : isConfirming ? "Really?" : "Delete"}
        </button>
      </Form>
      {isConfirming && !isDeleting && (
        <button
          onClick={() => setIsConfirming(false)}
          className="my-2 ml-4 inline-flex h-8 items-center self-center whitespace-nowrap rounded-full border-2 border-sky-500 bg-white px-4 text-sm font-semibold text-sky-500 transition hover:bg-sky-100 active:bg-sky-200"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
