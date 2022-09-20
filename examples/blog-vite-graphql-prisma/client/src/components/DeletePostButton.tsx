import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeletePostMutation } from "../graphql/generated/schema";

export function DeletePostButton({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const [mutate, { loading }] = useDeletePostMutation({
    refetchQueries: ["Blog", "BlogPost", "AdminPosts", "AdminEditPost"],
    onCompleted() {
      navigate("/admin/posts");
    },
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const onClick = () => {
    setIsConfirming(true);
  };
  const onConfirm = () => {
    mutate({ variables: { slug } });
  };

  return (
    <>
      <button
        key={String(isConfirming)}
        type="submit"
        name="action"
        disabled={loading}
        onClick={isConfirming ? onConfirm : onClick}
        className="ml-4 inline-flex h-8 items-center self-center whitespace-nowrap rounded-full border-2 border-red-500 bg-white px-4 text-sm font-semibold text-red-500 transition hover:bg-red-100 active:bg-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-white disabled:text-red-300 sm:h-10 sm:text-base"
      >
        {loading
          ? "Deleting..."
          : isConfirming
          ? "Really delete?"
          : "Delete Post"}
      </button>
      {isConfirming && !loading && (
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
