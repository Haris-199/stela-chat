import { Users, LogOut, Settings } from "lucide-react";

export default function Options() {
  return (
    <aside className="flex flex-col items-center gap-2 p-2 bg-gradient-to-b from-primary-900 via-primary-700 to-primary-800 shadow-lg">
      <button
        className="size-15 flex flex-col items-center p-2 rounded-lg hover:bg-primary-700 text-primary-100"
        title="Users"
      >
        <Users size={24} />
        <span className="text-xs mt-1">Users</span>
      </button>
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
      >
        <LogOut size={24} />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </aside>
  );
}
