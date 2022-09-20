import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

async function generateMarkdown() {
  const res = await fetch("https://jaspervdj.be/lorem-markdownum/markdown.txt");
  const md = await res.text();
  const body = md.split("\n").slice(2).join("\n");

  return body;
}

async function seed() {
  // Cleanup the existing database
  await prisma.post.deleteMany({});
  const now = new Date();

  const postBodies = await Promise.all(
    Array.from({ length: 5 }).map(generateMarkdown)
  );

  // Create between 10-20 posts
  const posts = Prisma.validator<Prisma.PostCreateManyInput[]>()(
    Array.from({ length: faker.datatype.number({ min: 10, max: 20 }) }, () => {
      const createdAt = faker.date.recent(365);

      return {
        slug: faker.helpers.unique(faker.lorem.slug),
        title: faker.lorem
          .sentence(faker.datatype.number({ min: 3, max: 5 }))
          .slice(0, -1),
        body: faker.helpers.arrayElement(postBodies),
        imageUrl: faker.image.unsplash.image(
          640,
          480,
          faker.helpers.unique(faker.hacker.noun)
        ),
        createdAt,
        updatedAt: faker.date.between(createdAt, now),
      };
    })
  );

  // Create between 0-20 comments per post
  const comments = Prisma.validator<Prisma.CommentCreateManyInput[]>()(
    posts.flatMap((post) =>
      Array.from(
        { length: faker.datatype.number({ min: 0, max: 20 }) },
        () => ({
          postSlug: post.slug,
          by: faker.internet.userName(),
          text: faker.lorem.sentences(),
          createdAt: faker.date.between(post.createdAt, now),
        })
      )
    )
  );

  await prisma.post.createMany({ data: posts });
  await prisma.comment.createMany({ data: comments });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
