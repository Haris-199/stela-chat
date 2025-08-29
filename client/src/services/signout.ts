import { removeItem } from "./localStorage";

export default function signout() {
  removeItem("user");
}
