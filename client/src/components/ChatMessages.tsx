import Message from "./Message";
import { getMessagesOfChat, Message as MessageType, UserPayload } from "../services/api";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Smile, Send } from "lucide-react";

export default function ChatMessages({
  userData,
  chatId,
}: {
  userData: UserPayload;
  chatId: number | undefined;
}) {
  const [msgs, setMsgs] = useState<MessageType[] | null>(null);
  const [emojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId !== undefined) {
      getMessagesOfChat(userData, chatId).then((res) => setMsgs(res.data));
    }
  }, [chatId, userData]);

  useEffect(() => {
    if (msgs !== null) bottomRef.current!.scrollIntoView();
  }, [msgs]);

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
        {msgs !== null && msgs.length > 0
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
