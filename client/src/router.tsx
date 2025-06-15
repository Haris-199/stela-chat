import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "chat", element: <Chat /> },
  { path: "profile", element: <Profile /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
