import { Chat as Chat_t, getChats, getMessagesOfChat, Message as Message_t } from "../services/api";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function Chat() {
  const { userData } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat_t[] | null>(null);
  const [currentChat, setCurrentChat] = useState(-1);
  const [msgs, setMsgs] = useState<Message_t[] | null>(null);

  useEffect(() => {
    getChats(userData!).then((res) => setChats(res.data));
    if (currentChat > -1) {
      getMessagesOfChat(userData!, currentChat).then((res) => setMsgs(res.data));
    }
  }, [currentChat, userData]);

  return (
    <div className="flex h-screen">
      <ChatSidebar chats={chats} currentChat={currentChat} setCurrentChat={setCurrentChat} />
      <main className="flex-1 flex flex-col bg-gradient-to-br from-primary-100 via-primary-200 to-primary-100">
        <ChatHeader currentChat={currentChat} chats={chats} />
        <MessageList msgs={msgs} currentChat={currentChat} />
        <MessageInput currentChat={currentChat} />
      </main>
    </div>
  );
}
