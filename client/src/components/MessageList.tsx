import Message from "./Message";
import { Message as Message_t } from "../services/api";

export default function MessageList({ msgs, currentChat }: {
  msgs: Message_t[] | null,
  currentChat: number
}) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {msgs && msgs.length > 0 ? (
        msgs.map((msg) => <Message key={msg.id} msg={msg} />)
      ) : currentChat > -1 ? (
        <div className="text-primary-700 text-center">No messages yet.</div>
      ) : (
        <div />
      )}
    </div>
  );
}
