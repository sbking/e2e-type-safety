import { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminEditPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../graphql/generated/schema";

const SLUG_REGEX = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

export function PostForm({
  post,
}: {
  post?: NonNullable<AdminEditPostQuery["post"]>;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();
  const [create, { loading: isCreating }] = useCreatePostMutation({
    refetchQueries: ["Blog", "AdminPosts"],
    onCompleted(data) {
      navigate(`/admin/posts/edit/${data.createPost.slug}`);
    },
  });
  const [update, { loading: isUpdating }] = useUpdatePostMutation({
    refetchQueries: ["Blog", "BlogPost", "AdminPosts", "AdminEditPost"],
    onCompleted(data) {
      if (data.updatePost.slug !== post?.slug) {
        navigate(`/admin/posts/edit/${data.updatePost.slug}`);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = { title, slug, imageUrl, body };
    if (post) {
      update({ variables: { slug: post.slug, data } });
    } else {
      create({ variables: { data } });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        <p className="mb-1 text-sm">Title *</p>
        <input
          type="text"
          placeholder="Title"
          required
          minLength={1}
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="mb-4 h-10 w-full rounded border border-slate-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">
          Slug *{" "}
          <span className="text-xs text-slate-500">
            (may contain the characters a-z, 0-9, and hyphens, and may not start
            or end with a hyphen)
          </span>
        </p>
        <input
          type="text"
          placeholder="Slug"
          required
          pattern={SLUG_REGEX}
          maxLength={255}
          value={slug}
          onChange={(e) => setSlug(e.currentTarget.value)}
          className="mb-4 h-10 w-full rounded border border-slate-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">Image URL *</p>
        <input
          type="url"
          placeholder="Image URL"
          required
          minLength={1}
          maxLength={255}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.currentTarget.value)}
          className="mb-4 h-10 w-full rounded border border-slate-300 px-2"
        />
      </label>

      <label>
        <p className="mb-1 text-sm">Body *</p>
        <textarea
          placeholder="Body"
          required
          minLength={1}
          maxLength={10000}
          value={body}
          onChange={(e) => setBody(e.currentTarget.value)}
          className="mb-4 h-[30rem] min-h-[30rem] w-full resize-y rounded border border-slate-300 p-2 font-mono text-sm"
        />
      </label>

      <div className="text-right">
        <button
          type="submit"
          disabled={isCreating || isUpdating || isSaved}
          className="mb-4 inline-flex h-10 items-center rounded-full bg-sky-500 px-4 font-semibold text-white transition hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-300"
        >
          {!post && (isCreating ? "Publishing..." : "Publish Post")}
          {post &&
            (isUpdating
              ? "Saving..."
              : isSaved
              ? "Changes Saved!"
              : "Save Changes")}
        </button>
      </div>
    </form>
  );
}
