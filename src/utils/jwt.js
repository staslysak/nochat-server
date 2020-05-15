import jwt from "jsonwebtoken";
import config from "../config";

export const decodeToken = (token) => {
  return jwt.decode(token);
};

const jwtVerify = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) =>
      err ? reject(err) : resolve(decoded)
    );
  });
};

const createToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

export const verifyRefreshToken = async (token, password) => {
  return jwtVerify(token, config.refreshToken.secret); // + password
};

export const verifyAccessToken = async (token) => {
  return jwtVerify(token, config.accessToken.secret);
};

export const extractTokens = (tokens) => {
  if (tokens.authorization) {
    return tokens.authorization;
  }
  return null;
};

export const createTokens = async ({ id, password }) => {
  const payload = { user: { id } };

  const accessToken = createToken(
    payload,
    config.accessToken.secret,
    config.accessToken.options
  );

  const refreshToken = createToken(
    payload,
    config.refreshToken.secret, //  + password,
    config.refreshToken.options
  );

  return { accessToken, refreshToken };
};

export const createVerificationToken = (secret) => {
  return createToken(
    { secret },
    config.accessToken.secret,
    config.accessToken.options
  );
};

export const refreshTokens = async (refreshToken, db) => {
  const { user } = jwt.decode(refreshToken);

  if (!user?.id) return {};

  return await db.user
    .findByPk(user.id)
    .then(async (user) => {
      if (user) {
        // refreshToken + user.password
        return await verifyRefreshToken(refreshToken).then(async ({ user }) => {
          const tokens = await createTokens(user);
          return { user, ...tokens };
        });
      }
      throw new Error("Invalid Token");
    })
    .catch(() => {
      return {};
    });
};
