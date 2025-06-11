import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col h-dvh">
      <div className="grid place-content-center grow">
        <button
          className="bg-red-300 p-3"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </div>
  );
}
