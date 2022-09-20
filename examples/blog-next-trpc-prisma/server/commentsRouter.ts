import { z } from "zod";
import { createComment, deleteComment } from "../models/comments";
import { t } from "./t";

export const commentsRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        postSlug: z.string(),
        by: z.string().min(1).max(255),
        text: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input }) => {
      await createComment(input);
    }),

  delete: t.procedure
    .input(
      z.object({
        postSlug: z.string(),
        commentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteComment(input.postSlug, input.commentId);
    }),
});
