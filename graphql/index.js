// export { default as resolvers } from "./resolvers";
// export { default as typeDefs } from "./types";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";

export const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./types")), {
  all: true
});

export const resolvers = mergeResolvers(fileLoader(path.join(__dirname, "./resolvers")));
