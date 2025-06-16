import { createContext, Dispatch } from "react";
import { UserPayload } from "../services/api";

const AuthContext = createContext<{
  userData?: UserPayload;
  setUserData: Dispatch<UserPayload | undefined>;
}>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserData: function (_value: UserPayload | undefined): void {
    throw new Error("Function not implemented.");
  }
});

export default AuthContext;
