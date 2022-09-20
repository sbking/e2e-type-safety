import { commentsRouter } from "./commentsRouter";
import { postsRouter } from "./postsRouter";
import { t } from "./t";

export const appRouter = t.router({
  comments: commentsRouter,
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
