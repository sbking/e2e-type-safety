import { PostForm } from "../components/PostForm";

export default function AdminNewPost() {
  return (
    <main className="container w-full text-left sm:my-6 sm:px-6">
      <div className="m-6 flex items-baseline justify-between sm:mx-0">
        <h1 className="mr-4 inline-block text-xl font-semibold sm:ml-0 sm:text-4xl">
          New Post
        </h1>
      </div>
      <div className="rounded-lg bg-white py-8 px-6 shadow">
        <PostForm />
      </div>
    </main>
  );
}
