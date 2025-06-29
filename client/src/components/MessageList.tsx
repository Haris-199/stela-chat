import Message from "./Message";
import { Chat, getMessagesOfChat, Message as MessageType, UserPayload } from "../services/api";
import { useEffect, useRef, useState } from "react";

export default function MessageList({
  userData,
  currentChat,
}: {
  userData: UserPayload;
  currentChat: Chat | null;
}) {
  const [msgs, setMsgs] = useState<MessageType[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChat !== null) {
      getMessagesOfChat(userData, currentChat.id).then((res) => setMsgs(res.data));
    }
  }, [currentChat, userData]);

  useEffect(() => {
    if (msgs !== null) bottomRef.current!.scrollIntoView();
  }, [msgs]);

  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-4 pb-0 space-y-4 overflow-hidden"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "var(--color-primary-300) var(--color-primary-200)",
      }}
    >
      {msgs !== null && msgs.length > 0
        ? msgs.map((msg) => <Message userData={userData} key={msg.id} msg={msg} />)
        : currentChat !== null && (
            <h1 className="text-primary-700 text-center font-bold">No messages yet.</h1>
          )}
      <div ref={bottomRef} />
    </div>
  );
}
