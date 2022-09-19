import type { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";

import { prisma } from "~/db.server";

export function listPostRows() {
  return prisma.post.findMany({
    select: {
      _count: { select: { comments: true } },
      slug: true,
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export function listPosts() {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
      body: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getPost(slug: string) {
  return prisma.post.findUniqueOrThrow({
    where: { slug },
    include: {
      comments: {
        select: {
          id: true,
          by: true,
          text: true,
          createdAt: true,
        },
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

export function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}

export async function loadPost(slug: string) {
  try {
    const post = await getPost(slug);
    return post;
  } catch (error) {
    throw json("Not Found", { status: 404 });
  }
}
