import type { Prisma } from "@prisma/client";

import prisma from "../lib/prisma";

export function createComment(data: Prisma.CommentUncheckedCreateInput) {
  return prisma.comment.create({ data });
}

export function deleteComment(postSlug: string, id: string) {
  // Delete the comment only if it actually belongs to this post slug
  return prisma.$transaction([
    prisma.comment.findFirstOrThrow({ where: { postSlug, id } }),
    prisma.comment.delete({ where: { id } }),
  ]);
}
