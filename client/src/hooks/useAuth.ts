import AuthContext from "../contexts/AuthContext";
import { removeItem } from "../services/localStorage";
import { useContext, useEffect } from "react";
import { isValid } from "../services/api";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { userData, setUserData } = useContext(AuthContext);

  const { data: valid, error, isPending } = useQuery({
    queryFn: async () => {
      if (userData === undefined) return false;
      return await isValid(userData);
    },
    queryKey: ["isValid", userData],
    staleTime: 1000 * 60 * 1, // 10 minutes
  });

  useEffect(() => {
    if (!isPending && (error !== null || valid === false)) {
      setUserData(undefined);
      removeItem("user");
    }
  }, [error, valid, isPending, setUserData]);

  return {
    userData: error || !valid ? undefined : userData,
    isAuthenticating: isPending,
  };
}
