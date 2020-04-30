import path from "path";
import { fileLoader, mergeResolvers } from "merge-graphql-schemas";

export const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "."))
);
