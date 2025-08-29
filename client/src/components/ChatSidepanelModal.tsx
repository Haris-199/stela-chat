import { useRef } from "react";
import ChatSidebar from "../components/ChatSidebar";
import Options from "../components/Options";
import { Chat, UserPayload } from "../types";
import { Menu } from "lucide-react";

export default function ChatSidepanelModal({
  userData,
  chatId,
  setCurrentChat,
}: {
  userData: UserPayload;
  chatId: number | undefined;
  setCurrentChat: (chat: Chat | null) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="med:hidden absolute top-2 left-3 z-20 size-12 flex items-center justify-center rounded-lg hover:bg-primary-200 text-primary-100"
        title="Chats"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Menu className="text-primary-800" size={30} />
      </button>
      <dialog
        className="max-h-none max-w-none h-screen flex max-[550px]:w-full"
        ref={dialogRef}
        style={{ background: "none" }}
        onClick={(e) => {
          const dims = dialogRef.current?.getBoundingClientRect();
          if (dims?.right === undefined || e.target !== dialogRef.current) return;
          if (
            e.clientY < dims.top ||
            e.clientX > dims.right ||
            e.clientY > dims.bottom ||
            e.clientX < dims.left
          )
            dialogRef.current?.close();
        }}
      >
        <Options userData={userData} />
        <ChatSidebar
          panelRef={dialogRef}
          userData={userData}
          chatId={Number(chatId)}
          setCurrentChat={setCurrentChat}
        />
      </dialog>
    </>
  );
}
