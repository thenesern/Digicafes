import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC,
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SEC, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Token is not valid" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token is not suppiled" });
  }
};
const isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "User is not admin" });
  }
};

export { signToken, isAuth, isAdmin };
