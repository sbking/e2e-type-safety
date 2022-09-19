import { json, redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import type { MouseEventHandler } from "react";
import { useState } from "react";

import { deletePost } from "~/models/posts.server";

/** Handles server action for deleting a post */
export async function deletePostAction(slug: string) {
  try {
    await deletePost(slug);
    return redirect(`/admin/posts`);
  } catch (error) {
    throw json("Not found", { status: 404 });
  }
}

/** Handles progressive enhancement for deleting a post */
export function DeletePostButton(props: { action: string }) {
  const transition = useTransition();
  const isDeleting =
    transition.submission?.formData.get("action") === props.action;

  const [isConfirming, setIsConfirming] = useState(false);
  const onClick: MouseEventHandler = (event) => {
    event.preventDefault();
    setIsConfirming(true);
  };

  return (
    <>
      <Form method="post" replace className="self-center">
        <button
          key={String(isConfirming)}
          type="submit"
          name="action"
          value={props.action}
          disabled={transition.state !== "idle"}
          onClick={isConfirming ? undefined : onClick}
          className="ml-4 inline-flex h-8 items-center whitespace-nowrap rounded-full border-2 border-red-500 bg-white px-4 text-sm font-semibold text-red-500 transition hover:bg-red-100 active:bg-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-white disabled:text-red-300 sm:h-10 sm:text-base"
        >
          {isDeleting
            ? "Deleting..."
            : isConfirming
            ? "Really delete?"
            : "Delete Post"}
        </button>
      </Form>
      {isConfirming && !isDeleting && (
        <button
          onClick={() => setIsConfirming(false)}
          className="ml-2 inline-flex h-8 items-center self-center whitespace-nowrap rounded-full border-2 border-sky-500 bg-white px-4 text-sm font-semibold text-sky-500 transition hover:bg-sky-100 active:bg-sky-200 sm:h-10 sm:text-base"
        >
          Cancel
        </button>
      )}
    </>
  );
}
