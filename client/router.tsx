import { createBrowserRouter } from "react-router-dom";
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Chat from "./src/pages/Chat";
import Profile from "./src/pages/Profile";
import NotFound from "./src/pages/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "chat", element: <Chat /> },
  { path: "profile", element: <Profile /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
