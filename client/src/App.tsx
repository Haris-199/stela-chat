import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import AuthContext from "./contexts/AuthContext.tsx";
import { useEffect, useState } from "react";
import { UserPayload, verify } from "./services/api";
import { getItem, removeItem } from "./services/localStorage";

export default function App() {
  const [userData, setUserData] = useState<UserPayload | undefined>(getItem("user"));

  useEffect(() => {
    if (userData !== undefined) {
      verify(userData.token).then((isValid) => {
        if (!isValid) {
          removeItem("user");
          setUserData(undefined);
        }
      });
    }
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AuthContext value={{ userData, setUserData }}>
        <RouterProvider router={router} />
      </AuthContext>
    </div>
  );
}
