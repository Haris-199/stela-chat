import { LogOut, Settings } from "lucide-react";
import UsersModal from "./UsersModal";
import useSignout from "../hooks/useSignout";
import { UserPayload } from "../types";

export default function Options({ userData }: { userData: UserPayload }) {
  const signout = useSignout();

  return (
    <aside className="flex flex-col items-center gap-2 p-2 bg-gradient-to-b from-primary-900 via-primary-700 to-primary-800 shadow-lg">
      <UsersModal userData={userData} />
      <button
        className="size-15 flex flex-col items-center p-2 rounded-lg hover:bg-primary-700 text-primary-100 mt-auto"
        title="Settings"
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </button>
      <button
        className="size-15 flex flex-col items-center p-2 rounded-lg hover:bg-primary-700 text-primary-100"
        title="Logout"
        onClick={() => signout()}
      >
        <LogOut size={24} />
        <span className="text-xs mt-1">Signout</span>
      </button>
    </aside>
  );
}
