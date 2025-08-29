import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate request body against a Zod schema.
 * If validation fails, it responds with a 400 status and error messages.
 * If validation succeeds, it attaches the validated data to req.body and calls next().
 *
 * @param {ZodSchema} schema - The Zod schema to validate against.
 * @returns {Function} - Express middleware function.
 */
const validate =
  (schema: ZodSchema, type: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const attempt = schema.safeParse(req[type]);

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
    req[type] = attempt.data;
    next();
  };

export default validate;
