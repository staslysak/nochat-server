import { AuthenticationError } from "apollo-server";

const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (root, args, context, info) => {
      await resolver(root, args, context, info);
      return childResolver(root, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export default createResolver((root, args, { user }) => {
  if (!user || !user.id) {
    throw new AuthenticationError("Unauthorized");
  }
});
