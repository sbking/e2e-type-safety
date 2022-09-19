import type { ActionArgs, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
import { format, parseISO } from "date-fns";
import prismStyles from "prism-themes/themes/prism-one-dark.css";
import { useRef } from "react";
import invariant from "tiny-invariant";

import {
  PostCommentForm,
  postCommentAction,
} from "~/components/PostCommentForm";
import { loadPost } from "~/models/posts.server";
import { htmlFromMarkdown } from "~/utils/markdown.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: prismStyles }];
};

/** Loads the blog post */
export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "Expected params.slug");
  const { body, ...post } = await loadPost(params.slug);
  const html = await htmlFromMarkdown(body);

  return json({ post: { ...post, html } });
}

// Server actions on this page
const POST_COMMENT = "postComment";

/** Handles server actions for this page */
export async function action({ params, request }: ActionArgs) {
  invariant(params.slug, "Expected params.slug");
  const formData = await request.formData();
  const action = formData.get("action");
  switch (action) {
    case POST_COMMENT:
      return postCommentAction(params.slug, formData);
    default:
      throw json(`Unknown action: ${action}`, { status: 400 });
  }
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <article
      key={post.slug}
      className="container max-w-screen-lg sm:my-12 sm:px-6"
    >
      <Post {...post} />

      <section className="mb-12 px-6">
        <h1 className="mb-6 font-serif text-2xl">
          Comments ({post.comments.length})
        </h1>

        {post.comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}

        <div className="mt-6">
          <h2 className="mb-4 font-serif text-lg">Leave a comment</h2>
          <PostCommentForm action={POST_COMMENT} />
        </div>
      </section>
    </article>
  );
}

function Post(props: SerializeFrom<typeof loader>["post"]) {
  const markdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mb-12 overflow-hidden bg-white pb-6 shadow sm:rounded-lg">
      <div className="mb-12 h-48 md:h-72">
        <img
          src={props.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mb-6 sm:flex sm:flex-col sm:items-center">
        <div className="prose prose-stone w-full max-w-full px-6 md:prose-lg md:px-12">
          <p>
            <Link
              to={`../admin/posts/edit/${props.slug}`}
              className="text-sky-500 no-underline hover:underline"
            >
              Edit post
            </Link>
          </p>
          <header className="mb-6">
            <h1 className="!mb-2 font-serif !leading-normal">{props.title}</h1>
            <time
              dateTime={props.createdAt}
              className="block font-sans text-base font-semibold uppercase text-red-500"
            >
              {format(parseISO(props.createdAt), "PPP")}
            </time>
          </header>
          <div
            ref={markdownRef}
            dangerouslySetInnerHTML={{ __html: props.html }}
          />
        </div>
      </div>
    </div>
  );
}

function Comment(
  props: SerializeFrom<typeof loader>["post"]["comments"][number]
) {
  return (
    <article
      key={props.id}
      className="border-t border-red-300 py-6 last-of-type:border-b"
    >
      <header>
        <h1 className="mr-2 mb-2 inline-block font-semibold">{props.by}</h1>
        <time dateTime={props.createdAt} className="text-stone-500">
          {format(parseISO(props.createdAt), "PPP")}
        </time>
      </header>
      <p>{props.text}</p>
    </article>
  );
}
