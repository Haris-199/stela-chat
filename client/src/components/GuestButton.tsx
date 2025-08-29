import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { guestLogin } from "../services/api";
import { setItem } from "../services/localStorage";

export default function GuestButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);

  async function handleClick() {
    const attempt = await guestLogin();
    if (attempt.success) {
      setItem("user", attempt.data);
      setUserData(attempt.data);
      navigate("/chat");
    }
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      Sign in as Guest
    </button>
  );
}
