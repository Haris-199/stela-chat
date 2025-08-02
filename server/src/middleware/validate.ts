import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const attempt = schema.safeParse(req.body);

  if (!attempt.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of attempt.error.issues) {
      const key = issue.path[0] || "unknown";
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }

    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }
  req.body = attempt.data;
  next();
};

export default validate;
