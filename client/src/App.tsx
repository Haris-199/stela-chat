import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import Container from "./components/Container.tsx";

export default function App() {
  return (
    <Container>
      <RouterProvider router={router} />
    </Container>
  );
}
