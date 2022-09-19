import type { SerializeFrom } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import type { loadPost } from "~/models/posts.server";
import { createPost, updatePost } from "~/models/posts.server";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Handles server action for creating or updating a post */
export async function postFormAction(
  existingSlug: string | null,
  formData: FormData
) {
  const result = z
    .object({
      title: z.string().min(1).max(255),
      slug: z.string().regex(SLUG_REGEX).max(255),
      imageUrl: z.string().url().min(1).max(255),
      body: z.string().min(1).max(10000),
    })
    .safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return json({ errors: result.error }, { status: 400 });
  }

  try {
    if (existingSlug) {
      await updatePost(existingSlug, result.data);
    } else {
      await createPost(result.data);
    }
    return redirect(`/admin/posts/edit/${result.data.slug}`);
  } catch (error) {
    throw json("Not found", { status: 404 });
  }
}

/** Handles progressive enhancement for updating a post */
export function PostForm(props: {
  action: string;
  post?: SerializeFrom<typeof loadPost>;
}) {
  const transition = useTransition();
  const isSubmitting =
    transition.submission?.formData.get("action") === props.action;

  // Lets us flash a "Changes Saved!" message after successfully updating a post
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (isSubmitting && transition.type === "actionRedirect") {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    }
  }, [isSubmitting, transition]);

  return (
    <Form method="post" replace>
      <label>
        <p className="mb-1 text-sm">Title *</p>
        <input
          type="text"
          name="title"
          defaultValue={props.post?.title}
          placeholder="Title"
          required
          minLength={1}
          maxLength={255}
          className="mb-4 h-10 w-full rounded border border-stone-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">
          Slug *{" "}
          <span className="text-xs text-stone-500">
            (may contain the characters a-z, 0-9, and hyphens, and may not start
            or end with a hyphen)
          </span>
        </p>
        <input
          type="text"
          name="slug"
          defaultValue={props.post?.slug}
          placeholder="Slug"
          required
          pattern={SLUG_REGEX.toString().slice(1, -1)}
          maxLength={255}
          className="mb-4 h-10 w-full rounded border border-stone-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">Image URL *</p>
        <input
          type="url"
          name="imageUrl"
          defaultValue={props.post?.imageUrl}
          placeholder="Image URL"
          required
          minLength={1}
          maxLength={255}
          className="mb-4 h-10 w-full rounded border border-stone-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">Body *</p>
        <textarea
          name="body"
          defaultValue={props.post?.body}
          placeholder="Body"
          required
          minLength={1}
          maxLength={10000}
          className="mb-4 h-[30rem] min-h-[30rem] w-full resize-y rounded border border-stone-300 p-2 font-mono text-sm"
        />
      </label>

      <div className="text-right">
        <button
          type="submit"
          name="action"
          value={props.action}
          disabled={transition.state !== "idle" || isSaved}
          className="mb-4 inline-flex h-10 items-center rounded-full bg-sky-500 px-4 font-semibold text-white transition hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-300"
        >
          {!props.post && (isSubmitting ? "Publishing..." : "Publish Post")}
          {props.post &&
            (isSubmitting
              ? "Saving..."
              : isSaved
              ? "Changes Saved!"
              : "Save Changes")}
        </button>
      </div>
    </Form>
  );
}
