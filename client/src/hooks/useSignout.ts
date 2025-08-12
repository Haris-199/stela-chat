import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { removeItem } from "../services/localStorage";
import { useNavigate } from "react-router-dom";

export default function useSignout() {
  const { setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  return () => {
    setUserData(undefined);
    removeItem("user");
    navigate("/");
  };
}
