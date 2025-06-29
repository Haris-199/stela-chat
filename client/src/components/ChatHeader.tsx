import { MessageCircle } from "lucide-react";

export default function ChatHeader({ name }: { name: string }) {
  return (
    <div className="flex items-center px-6 md:py-4 shadow-lg">
      <MessageCircle className="text-primary-800 ml-3" size={28} />
      <h1 className="pl-3 py-4 flex items-center text-2xl font-bold text-primary-800">
        {name}
      </h1>
    </div>
  );
}
