export default function MessageInput({ currentChat }: { currentChat: number }) {
  return currentChat > -1 ? (
    <form className="p-4 flex gap-2">
      <input
        type="text"
        className="flex-1 px-4 py-2 border-primary-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/80"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gradient-to-br from-primary-400 to-primary-500 text-white rounded font-semibold hover:from-primary-500 hover:to-primary-600 transition-colors"
        disabled
      >
        Send
      </button>
    </form>
  ) : (
    <div />
  );
}
