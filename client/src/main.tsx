import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "../router.tsx";
import Container from "./components/Container.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container>
      <RouterProvider router={router} />
    </Container>
  </StrictMode>
);
