import { User as UserType } from "./";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}
