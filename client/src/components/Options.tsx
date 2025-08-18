import { LogOut, Settings } from "lucide-react";
import FriendsModal from "./FriendsModal";
import useSignout from "../hooks/useSignout";
import { UserPayload } from "../types";
import { useState } from "react";

export default function Options({ userData }: { userData: UserPayload }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const signout = useSignout();

  return (
    <aside className="flex flex-col items-center gap-2 p-2 bg-gradient-to-b from-primary-900 via-primary-700 to-primary-800 shadow-lg">
      <FriendsModal userData={userData} />
      <button
        className="size-15 flex flex-col items-center p-2 rounded-lg hover:bg-primary-700 text-primary-100 mt-auto relative"
        title="Settings"
        onClick={() => {
          setMenuOpen(!menuOpen);
          setTimeout(() => {
            setMenuOpen(false);
          }, 2500);
        }}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
        {menuOpen && <ComingSoon />}
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

function ComingSoon() {
  return (
    <div className="absolute text-primary-700 font-semibold left-15 mt-2 w-40 bg-white rounded-lg shadow-lg border border-primary-200 z-50 flex flex-col">
      This feature is not implemented yet.
    </div>
  );
}
