import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../lib/trpc";

export function DeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.posts.delete.useMutation({
    async onSuccess() {
      await router.replace("/admin/posts");
      utils.posts.list.invalidate();
      utils.posts.table.invalidate();
      utils.posts.getHTML.invalidate({ slug });
      utils.posts.getMarkdown.invalidate({ slug });
    },
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const onClick = () => {
    setIsConfirming(true);
  };
  const onConfirm = () => {
    mutation.mutate({ slug });
  };

  return (
    <>
      <button
        key={String(isConfirming)}
        type="submit"
        name="action"
        disabled={mutation.isLoading}
        onClick={isConfirming ? onConfirm : onClick}
        className="ml-4 inline-flex h-8 items-center self-center whitespace-nowrap rounded-full border-2 border-red-500 bg-white px-4 text-sm font-semibold text-red-500 transition hover:bg-red-100 active:bg-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-white disabled:text-red-300 sm:h-10 sm:text-base"
      >
        {mutation.isLoading
          ? "Deleting..."
          : isConfirming
          ? "Really delete?"
          : "Delete Post"}
      </button>
      {isConfirming && !mutation.isLoading && (
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
