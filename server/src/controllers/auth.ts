import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Prisma } from "../../prisma/generated/prisma";
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
      const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
      if (user !== null) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export const postGuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user;
    while (true) {
      try {
        const hashedPassword = await bcrypt.hash("password", 10);
        user = await prisma.user.create({
          data: {
            username: `Guest_${Math.random().toString(36).slice(2, 10)}`,
            password: hashedPassword,
            guestExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
          },
        });
        break;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") continue; // Unique constraint failed
        }
        throw error;
      }
    }

    const userPayload = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "Guest account created.",
      data: {
        token: jwt.sign(userPayload, JWT_KEY, {
          expiresIn: 60 * 60 * 24, // 1 day
        }),
        user: userPayload,
      },
    });
  } catch (error) {
    next(error);
  }
};

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
            expiresIn:
              user.guestExpiry === null
                ? 60 * 60 * 24 * 7 // 7 days
                : Math.max(Math.floor((user.guestExpiry.getTime() - Date.now()) / 1000), 0), // Remaining time for guest users
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });
    res.json({
      success: true,
      message: "User successfully created.",
    });
  } catch (err) {
    next(err);
  }
};
