import { format, parseISO } from "date-fns";
import "prism-themes/themes/prism-one-dark.css";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { Loading } from "../components/Loading";
import { PostCommentForm } from "../components/PostCommentForm";
import { BlogPostQuery, useBlogPostQuery } from "../graphql/generated/schema";

export default function BlogPost() {
  const slug = useParams().slug as string;
  const { data } = useBlogPostQuery({ variables: { slug } });

  const post = data?.post;
  if (!post) {
    return <Loading />;
  }

  return (
    <article
      key={post.slug}
      className="container max-w-screen-lg sm:my-12 sm:px-6"
    >
      <Post {...post} />

      <section className="mb-12 px-6">
        <h1 className="mb-6 font-serif text-2xl">
          Comments ({post.comments?.length ?? 0})
        </h1>

        {post.comments?.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}

        <div className="mt-6">
          <h2 className="mb-4 font-serif text-lg">Leave a comment</h2>
          <PostCommentForm postSlug={post.slug} />
        </div>
      </section>
    </article>
  );
}

function Post(props: NonNullable<BlogPostQuery["post"]>) {
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
              className="block font-sans text-base font-semibold uppercase text-indigo-500"
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
  props: NonNullable<NonNullable<BlogPostQuery["post"]>["comments"]>[number]
) {
  return (
    <article
      key={props.id}
      className="border-t border-indigo-300 py-6 last-of-type:border-b"
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
