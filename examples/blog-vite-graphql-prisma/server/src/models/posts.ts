import type { Post, Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export { Post };

export function listPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function getPost(slug: string) {
  return prisma.post.findUniqueOrThrow({
    where: { slug },
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export function createPost(data: Prisma.PostCreateInput) {
  return prisma.post.create({ data });
}

export function updatePost(slug: string, data: Prisma.PostUpdateInput) {
  return prisma.post.update({ where: { slug }, data });
}

export async function deletePost(slug: string) {
  await prisma.post.delete({ where: { slug } });
  return slug;
}
