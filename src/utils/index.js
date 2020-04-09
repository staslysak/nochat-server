import { DEFAULT_AVATARS } from "../constants";
export * from "./tokens";
export * from "./auth";

export const shortCodeGen = () => `${Math.floor(Math.random() * 1e5)}`;

export const avatarGen = () => {
  const gradients = [...DEFAULT_AVATARS];
  const idx = Math.floor(Math.random() * gradients.length);
  return gradients[idx];
};

export const formatErrors = (e, models) => {
  const validationErrors = {};
  if (e instanceof models.Sequelize.ValidationError) {
    e.errors.forEach(({ path, message }) => (validationErrors[path] = message));
  }
  return validationErrors;
};

export const getHost = (url) => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000" + url;
  }
  return "/" + url;
};
