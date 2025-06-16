import { Link } from "react-router-dom";
import { Chat as Chat_t, getChats, getMessagesOfChat, Message } from "../services/api";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function Chat() {
  const { userData } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat_t[] | null>(null);
  const [currentChat, setCurrentChat] = useState(-1);
  const [msgs, setMsgs] = useState<Message[] | null>(null);

  useEffect(() => {
    getChats(userData!).then((res) => setChats(res.data));
    if (currentChat > -1) {
      getMessagesOfChat(userData!, currentChat).then((res) => setMsgs(res.data));
    }
  }, [currentChat, userData]);

  return (
    <main>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/Login"}>Login</Link>
        </li>
        <li>
          <Link to={"/Register"}>Register</Link>
        </li>
        <li>
          <Link to={"/Chat"}>Chat</Link>
        </li>
        <li>
          <Link to={"/Profile"}>Profile</Link>
        </li>
      </ul>
      <h1 className="bg-blue-300">Chat</h1>

      {/* chats */}
      {chats &&
        chats.map((chat) => (
          <button onClick={() => setCurrentChat(chat.id)} key={chat.id}>
            {JSON.stringify(chat)}
          </button>
        ))}

      {/* messages */}
      <div className="bg-blue-300">
        {msgs && msgs.map((msg) => <p key={msg.id}>{JSON.stringify(msg)}</p>)}
      </div>
    </main>
  );
}
