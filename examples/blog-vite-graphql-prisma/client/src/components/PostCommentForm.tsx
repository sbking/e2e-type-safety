import { FormEventHandler, useState } from "react";
import { useCreateCommentMutation } from "../graphql/generated/schema";

export function PostCommentForm({ postSlug }: { postSlug: string }) {
  const [by, setBy] = useState("");
  const [text, setText] = useState("");

  const [mutate, { loading }] = useCreateCommentMutation({
    refetchQueries: ["BlogPost", "AdminPosts", "AdminEditPost"],
    onCompleted() {
      setBy("");
      setText("");
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = { postSlug, by, text };
    mutate({ variables: { data } });
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
        disabled={loading}
        className="inline-flex h-10 items-center rounded-full bg-indigo-500 p-4 font-semibold text-white hover:bg-indigo-600 active:bg-indigo-700"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
