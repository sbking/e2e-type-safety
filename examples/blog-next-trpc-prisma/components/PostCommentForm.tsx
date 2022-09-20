import { FormEventHandler, useState } from "react";
import { trpc } from "../lib/trpc";

export function PostCommentForm({ postSlug }: { postSlug: string }) {
  const [by, setBy] = useState("");
  const [text, setText] = useState("");

  const utils = trpc.useContext();
  const mutation = trpc.comments.create.useMutation({
    onSuccess() {
      setBy("");
      setText("");
      utils.posts.getHTML.invalidate({ slug: postSlug });
      utils.posts.getMarkdown.invalidate({ slug: postSlug });
      utils.posts.table.invalidate();
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    mutation.mutate({ postSlug, by, text });
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        <p className="mb-1 text-sm">Name *</p>
        <input
          type="text"
          placeholder="Name"
          required
          minLength={1}
          maxLength={255}
          value={by}
          onChange={(e) => setBy(e.currentTarget.value)}
          className="mb-4 h-10 w-full rounded border border-stone-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">Comment *</p>
        <textarea
          placeholder="Comment"
          required
          minLength={1}
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          className="mb-4 h-20 min-h-[5rem] w-full resize-y rounded border border-stone-300 p-2"
        />
      </label>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="inline-flex h-10 items-center rounded-full bg-teal-500 p-4 font-semibold text-white hover:bg-teal-600 active:bg-teal-700"
      >
        {mutation.isLoading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
