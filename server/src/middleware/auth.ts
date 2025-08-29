import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateCallback } from "passport";

/**
 * This middleware verifies the JWT token present in the request.
 * If authentication is successful, the user information is attached to the request object and can be accessed via `req.user`.
 *
 * @returns {Function} The middleware function that authenticates the request using JWT.
 * @remarks
 * - Sessions are disabled (`session: false`), so authentication is stateless.
 *
 * @example
 * ```typescript
 * app.get('/protected', authenticateJWT, (req, res) => {
 *   res.send('This route is protected');
 * });
 * ```
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const cb: AuthenticateCallback = (err, user, info, status) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }
    req.user = user;
    next();
  };
  passport.authenticate("jwt", { session: false }, cb)(req, res, next);
};

/*
app.get("/protected", function (req, res, next) {
  passport.authenticate("local", function (err, user, info, status) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/signin");
    }
    res.redirect("/account");
  })(req, res, next);
});
*/
