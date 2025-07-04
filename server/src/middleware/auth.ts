import passport from "passport";

/**
 * This middleware verifies the JWT token present in the request.
 * If authentication is successful, the user information is attached to the request object and can be accessed via `req.user`.
 *
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
export const authenticateJWT = passport.authenticate("jwt", { session: false });
