import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const { JWT_KEY } = process.env;

if (JWT_KEY === undefined) {
  throw new Error("JWT_KEY not defined;");
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_KEY,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });

      if (user !== null) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user === null) {
      res.status(400).json({
        success: false,
        errors: {
          username: ["Incorrect username or user does not exist."],
        },
      });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const userPayload = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res.json({
        success: true,
        message: "Logged in successfully.",
        data: {
          token: jwt.sign(userPayload, JWT_KEY, {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
          }),
          user: userPayload,
        },
      });
      return;
    }
  } catch (error) {
    next(error);
  }

  res.status(400).json({
    success: false,
    errors: {
      password: ["Incorrect password."],
    },
  });
};

export const postRegister = async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: { username: req.body.username },
  });

  if (user !== null) {
    res.status(400).json({
      success: false,
      errors: {
        username: ["Username is taken."],
      },
    });
    return;
  }

  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        next(err);
        return;
      }

      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword!,
        },
      });
    });
    res.json({
      success: true,
      message: "User successfully created.",
    });
  } catch (err) {
    next(err);
  }
};
