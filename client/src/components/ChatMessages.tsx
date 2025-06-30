import Message from "./Message";
import { Chat, getMessagesOfChat, UserPayload } from "../services/api";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Smile, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ChatMessages({
  userData,
  currentChat,
}: {
  userData: UserPayload;
  currentChat: Chat;
}) {
  const [emojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatId = currentChat.id;
  const { data: msgs, isLoading } = useQuery({
    queryFn: () => getMessagesOfChat(userData, chatId).then((res) => res.data),
    queryKey: ["Messages", chatId, userData],
  });

  useEffect(() => {
    if (msgs !== null) bottomRef.current!.scrollIntoView();
  }, [msgs]);

  if (isLoading) {
    return <SkeletonLoader ref={bottomRef} />;
  }

  return (
    <>
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4 pb-0 space-y-4 overflow-hidden"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-primary-300) var(--color-primary-200)",
        }}
      >
        {msgs !== undefined && msgs.length > 0
          ? msgs.map((msg) => <Message userData={userData} key={msg.id} msg={msg} />)
          : chatId !== undefined && (
              <h1 className="text-primary-700 text-center font-bold">No messages yet.</h1>
            )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="p-4 pr-6 flex gap-2 items-center">
        <button
          type="button"
          className={`p-2 rounded-full text-primary-400 relative hover:bg-primary-100 focus-visible:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
            emojiPanelOpen ? "bg-primary-100" : ""
          }`}
          title="Add emoji"
          onClick={() => setEmojiPanelOpen(!emojiPanelOpen)}
        >
          <Smile size={25} />
          <div className={"absolute bottom-14 left-0 z-20 w-10 bg:red"}>
            <EmojiPicker
              emojiStyle={EmojiStyle.NATIVE}
              width={300}
              open={emojiPanelOpen}
              onEmojiClick={(emojiData) => setTextInput((prevText) => prevText + emojiData.emoji)}
              lazyLoadEmojis
            />
          </div>
        </button>
        <textarea
          className="no-scrollbar bg-white overflow-visible resize-none grow px-4 py-2 border-primary-400 text-wrap rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          placeholder="Type your message..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={1}
        />
        <button
          type="submit"
          className="p-2 size-10 relative rounded-full bg-gradient-to-br from-primary-400 to-primary-500 text-white font-semibold hover:from-primary-500 hover:to-primary-600 transition-colors disabled:opacity-60"
          disabled
          title="Send"
        >
          <Send size={24} className="absolute top-[22%] left-[18%]" />
        </button>
      </form>
    </>
  );
}

function SkeletonLoader({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) {
  const N = 5;
  const messages = [<IncomingMessageSkeleton key={0} />, <OutgoingMessageSkeleton key={1} />];
  const ran = Math.floor(Math.random() * (N - 2));

  for (let i = 0; i < ran; i++) {
    messages.push(<IncomingMessageSkeleton key={2 + i} />);
  }
  for (let i = 0; i < N - ran - 2; i++) {
    messages.push(<OutgoingMessageSkeleton key={2 + ran + i} />);
  }

  for (let i = 0; i < N; i++) {
    const j = Math.floor(Math.random() * N);
    [messages[i], messages[j]] = [messages[j], messages[i]];
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 pb-0 space-y-4 overflow-hidden">
      {messages}
      <div ref={ref} />
    </div>
  );
}

function IncomingMessageSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-[auto_1fr_auto] items-center gap-x-2 text-transparent">
      <div className="col-start-2 row-start-1 flex gap-1 items-center ml-3 text-sm">
        <span className="rounded-full bg-primary-300/60">Username</span>
        <span className="rounded-full bg-primary-300/30">8:00 AM</span>
      </div>
      <div className="col-start-1 row-start-2">
        <div className="size-12 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center font-bold shadow" />
      </div>
      <div className="col-start-2 row-start-2 px-4 py-2 rounded-2xl shadow-md bg-white/60 flex flex-col mr-auto">
        <div className="break-words">This is a message for the skeleton loader.</div>
      </div>
    </div>
  );
}

function OutgoingMessageSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-[auto_1fr_auto] items-center gap-x-2 text-transparent">
      <div className="col-start-2 row-start-1 flex gap-1 items-center justify-self-end mr-3 text-sm">
        <span className="rounded-full bg-primary-300/30">8:00 AM</span>
        <span className="rounded-full bg-primary-300/60">Person</span>
      </div>
      <div className="col-start-3 row-start-2">
        <div className="size-12 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center font-bold shadow" />
      </div>
      <div className="col-start-2 row-start-2 px-4 py-2 rounded-2xl shadow-md bg-white/60 flex flex-col ml-auto">
        <div className="break-words">This is a message for the skeleton loader.</div>
      </div>
    </div>
  );
}
