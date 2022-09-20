import type { Comment, Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export { Comment };

export function commentsByPostSlug(slug: string) {
  return prisma.post
    .findUnique({ where: { slug } })
    .comments({ orderBy: { createdAt: "asc" } });
}

export async function commentCountByPostSlug(slug: string) {
  const result = await prisma.post.findUnique({
    where: { slug },
    select: { _count: { select: { comments: true } } },
  });
  return result?._count.comments ?? 0;
}

export function createComment(data: Prisma.CommentUncheckedCreateInput) {
  return prisma.comment.create({ data });
}

export async function deleteComment(postSlug: string, id: string) {
  // Delete the comment only if it actually belongs to this post slug
  await prisma.$transaction([
    prisma.comment.findFirstOrThrow({ where: { postSlug, id } }),
    prisma.comment.delete({ where: { id } }),
  ]);
  return id;
}
