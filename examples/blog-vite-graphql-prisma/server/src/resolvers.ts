import { DateTimeResolver as DateTime } from "graphql-scalars";
import { htmlFromMarkdown } from "./markdown";
import {
  commentCountByPostSlug,
  commentsByPostSlug,
  createComment,
  deleteComment,
} from "./models/comments";
import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from "./models/posts";

import { Resolvers } from "./resolvers-types";

export const resolvers: Resolvers = {
  DateTime,

  Query: {
    post: (_, args) => getPost(args.slug),
    posts: () => listPosts(),
  },

  Mutation: {
    createPost: (_, args) => createPost(args.data),
    updatePost: (_, args) => updatePost(args.slug, args.data),
    deletePost: (_, args) => deletePost(args.slug),
    createComment: (_, args) => createComment(args.data),
    deleteComment: (_, args) => deleteComment(args.postSlug, args.commentId),
  },

  Post: {
    html: (post) => htmlFromMarkdown(post.body),
    comments: (post) => commentsByPostSlug(post.slug),
    commentCount: (post) => commentCountByPostSlug(post.slug),
  },
};
