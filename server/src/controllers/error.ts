import { Prisma } from "../../prisma/generated/prisma";
import { Request, Response, NextFunction } from "express";

export const serverErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const date = new Date();
  console.error(`${date.toDateString()} ${date.toLocaleTimeString()} - ${err}`);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code.startsWith("P2")) {
      res.status(500).json({
        success: false,
        message: "Invalid Query sent to the database.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong with the database.",
      });
    }
    return;
  }
  res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
};

export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Sorry, the resource you're looking for could not be found.",
  });
};
