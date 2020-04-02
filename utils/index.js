import chalk from "chalk";
export * from "./tokens";
export * from "./auth";

export const shortCodeGen = () => `${Math.floor(Math.random() * 1e5)}`;

export const avatarGen = () => {
  const gradients = [
    "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
    "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)"
  ];
  const idx = Math.floor(Math.random() * gradients.length);
  return gradients[idx];
};

export const logger = (msg, color = "green") => console.log(chalk[color](msg));

export const formatErrors = (e, models) => {
  const validationErrors = {};
  if (e instanceof models.Sequelize.ValidationError) {
    e.errors.forEach(({ path, message }) => (validationErrors[path] = message));
  }
  return validationErrors;
};
