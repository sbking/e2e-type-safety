import fs from "fs";
import { resolve } from "path";

import { ApolloServer } from "apollo-server";

import { context } from "./context";
import { resolvers } from "./resolvers";

const typeDefs = fs.readFileSync(
  resolve(__dirname, "..", "schema.graphqls"),
  "utf-8"
);

const port = process.env.PORT ?? 4000;

new ApolloServer({ resolvers, typeDefs, context }).listen({ port }, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});
