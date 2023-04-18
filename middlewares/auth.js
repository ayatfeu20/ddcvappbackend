import expressJwt from "express-jwt";
export const requireSignIn = expressJwt({
  secret: process.env.TOKEN_KEY,
  algorithms: ["HS256"],
});
