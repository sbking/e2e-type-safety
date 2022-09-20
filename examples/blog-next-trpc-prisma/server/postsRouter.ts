import { z } from "zod";
import { htmlFromMarkdown } from "../lib/markdown";
import {
  createPost,
  deletePost,
  getPost,
  listPostRows,
  listPosts,
  updatePost,
} from "../models/posts";
import { t } from "./t";

const PostData = z.object({
  title: z.string().min(1).max(255),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(255),
  imageUrl: z.string().url().min(1).max(255),
  body: z.string().min(1).max(10000),
});

export const postsRouter = t.router({
  table: t.procedure.input(z.void()).query(listPostRows),

  list: t.procedure.input(z.void()).query(listPosts),

  getMarkdown: t.procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => getPost(input.slug)),

  getHTML: t.procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { body, ...post } = await getPost(input.slug);
      const html = await htmlFromMarkdown(body);
      return { html, ...post };
    }),

  create: t.procedure
    .input(z.object({ data: PostData }))
    .mutation(async ({ input }) => {
      await createPost(input.data);
    }),

  update: t.procedure
    .input(z.object({ slug: z.string(), data: PostData }))
    .mutation(async ({ input }) => {
      await updatePost(input.slug, input.data);
    }),

  delete: t.procedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      await deletePost(input.slug);
    }),
});
