import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { Message as Message_t } from "../services/api";

export default function Message({ msg }: { msg: Message_t }) {
  const { userData } = useContext(AuthContext);
  const isOwn = userData && msg.sender.username === userData.user.username;

  return (
    <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
      <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? "flex-row-reverse" : ""}`}>
        <span className={`text-xs font-semibold text-primary-700 ${isOwn ? "mr-15" : "ml-15"}`}>
          {msg.sender.username}
        </span>
        <span className="text-xs text-gray">
          {msg.updatedAt ? new Date(msg.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
        </span>
      </div>
      <div className={`flex items-center gap-3 ${isOwn ? "justify-end flex-row-reverse" : "justify-start"}`}>
        <Avatar letter={msg.sender.username[0].toUpperCase()} />
        <div
          className={`px-4 py-2 rounded-2xl shadow-md bg-white/80 border border-primary-200 flex flex-col ${
            isOwn ? "ml-auto bg-primary-200 text-primary-900" : "bg-white text-primary-800"
          }`}
        >
          <div className="break-words">{msg.text}</div>
        </div>
      </div>
    </div>
  );
}
