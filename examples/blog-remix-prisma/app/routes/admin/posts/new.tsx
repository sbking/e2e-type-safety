import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { PostForm, postFormAction } from "~/components/PostForm";

// Server actions on this page
const CREATE_POST = "createPost";

/** Handles server actions for this page */
export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  switch (action) {
    case CREATE_POST:
      return postFormAction(null, formData);
    default:
      throw json(`Unknown action: ${action}`, { status: 400 });
  }
}

export default function PostAdmin() {
  return (
    <main className="container w-full text-left sm:my-6 sm:px-6">
      <div className="m-6 flex items-baseline justify-between sm:mx-0">
        <h1 className="mr-4 inline-block text-xl font-semibold sm:ml-0 sm:text-4xl">
          New Post
        </h1>
      </div>
      <div className="rounded-lg bg-white py-8 px-6 shadow">
        <PostForm action={CREATE_POST} />
      </div>
    </main>
  );
}
