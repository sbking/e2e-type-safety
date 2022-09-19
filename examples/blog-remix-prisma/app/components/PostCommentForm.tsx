import { Form, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { createComment } from "~/models/comments.server";

/** Handles server action for posting a comment */
export async function postCommentAction(postSlug: string, formData: FormData) {
  const result = z
    .object({
      by: z.string().min(1).max(255),
      text: z.string().min(1).max(1000),
    })
    .safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return json({ errors: result.error }, { status: 400 });
  }

  try {
    await createComment({ postSlug, ...result.data });
    return redirect(`/blog/${postSlug}`);
  } catch (error) {
    throw json("Not found", { status: 404 });
  }
}

/** Handles progressive enhancement for posting a comment */
export function PostCommentForm(props: { action: string }) {
  const transition = useTransition();
  const isPosting =
    transition.submission?.formData.get("action") === props.action;

  // Clear the form on success
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (isPosting && transition.type === "actionRedirect") {
      formRef.current?.reset();
    }
  }, [isPosting, transition]);

  return (
    <Form ref={formRef} method="post" replace>
      <label>
        <p className="mb-1 text-sm">Name *</p>
        <input
          type="text"
          name="by"
          placeholder="Name"
          required
          minLength={1}
          maxLength={255}
          className="mb-4 h-10 w-full rounded border border-stone-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">Comment *</p>
        <textarea
          name="text"
          placeholder="Comment"
          required
          minLength={1}
          maxLength={1000}
          className="mb-4 h-20 min-h-[5rem] w-full resize-y rounded border border-stone-300 p-2"
        />
      </label>

      <button
        type="submit"
        name="action"
        value={props.action}
        disabled={transition.state !== "idle"}
        className="inline-flex h-10 items-center rounded-full bg-red-500 p-4 font-semibold text-white hover:bg-red-600 active:bg-red-700"
      >
        {isPosting ? "Posting..." : "Post Comment"}
      </button>
    </Form>
  );
}
