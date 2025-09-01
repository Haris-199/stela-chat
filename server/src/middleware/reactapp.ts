import { Request, Response, NextFunction } from "express";
import path from "path";

const serveReactApp = (req: Request, res: Response, next: NextFunction) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
    return;
  }

  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
};

export default serveReactApp;
