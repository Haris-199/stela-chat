import Avatar from "./Avatar";
import { Message as MessageType, UserPayload } from "../types";

export default function Message({ userData, msg }: { userData: UserPayload; msg: MessageType }) {
  const isOwn = userData && msg.sender.username === userData.user.username;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
      <div
        className={`col-start-2 row-start-1 flex gap-2 items-center ${
          isOwn ? "flex-row-reverse" : ""
        }`}
      >
        <span className={`text-sm font-semibold text-primary-700 ${isOwn ? "mr-3" : "ml-3"}`}>
          {isOwn ? "You" : msg.sender.username}
        </span>
        <span className={`text-xs text-gray`}>
          {msg.updatedAt &&
            new Date(msg.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </span>
      </div>
      {isOwn ? (
        <div className={`col-start-3 row-start-2`}>
          <Avatar letter={msg.sender.username[0].toUpperCase()} className="size-12" />
        </div>
      ) : (
        <div className={`col-start-1 row-start-2`}>
          <Avatar letter={msg.sender.username[0].toUpperCase()} className="size-12" />
        </div>
      )}
      <div
        className={`col-start-2 row-start-2 px-4 py-2 rounded-2xl shadow-md bg-white/80 border border-primary-200 flex flex-col ${
          isOwn ? "ml-auto" : "mr-auto"
        }`}
      >
        <div className="break-words">{msg.text}</div>
      </div>
    </div>
  );
}
