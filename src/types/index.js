import path from "path";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";

export const typeDefs = mergeTypes(fileLoader(path.join(__dirname, ".")), {
  all: true,
});
