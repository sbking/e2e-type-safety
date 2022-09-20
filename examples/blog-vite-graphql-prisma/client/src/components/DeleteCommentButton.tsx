import { useState } from "react";
import { useDeleteCommentMutation } from "../graphql/generated/schema";

export function DeleteCommentButton({
  postSlug,
  commentId,
}: {
  postSlug: string;
  commentId: string;
}) {
  const [mutate, { loading }] = useDeleteCommentMutation({
    refetchQueries: ["BlogPost", "AdminPosts", "AdminEditPost"],
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const onClick = () => {
    setIsConfirming(true);
  };
  const onConfirm = () => {
    mutate({ variables: { postSlug, commentId } });
  };

  return (
    <div className="sm:w-48 sm:whitespace-nowrap">
      <button
        disabled={loading}
        onClick={isConfirming ? onConfirm : onClick}
        className="my-2 inline-flex h-8 items-center whitespace-nowrap rounded-full border-2 border-red-500 bg-white px-4 text-sm font-semibold text-red-500 transition hover:bg-red-100 active:bg-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-white disabled:text-red-300"
      >
        {loading ? "Deleting..." : isConfirming ? "Really?" : "Delete"}
      </button>
      {isConfirming && !loading && (
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
