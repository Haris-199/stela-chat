import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function ServerError() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 via-primary-300 to-primary-400">
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl bg-white/90">
        <h1 className="text-5xl font-bold text-red-600 mb-2">Server Error</h1>
        <p className="text-lg text-red-600 text-center">
          Sorry, something went wrong on our end.
          <br />
          Please try again later.
        </p>
        <AlertTriangle className="w-20 h-20 text-red-500 my-3 animate-pulse" />
        <nav className="flex flex-wrap gap-3 justify-center">
          {userData === undefined ? (
            <Link
              to="/"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors font-semibold"
            >
              Home
            </Link>
          ) : (
            <Link
              to="/chat"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors font-semibold"
            >
              Your Chats
            </Link>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white text-primary-600 rounded-lg border border-primary-300 shadow hover:cursor-pointer hover:bg-primary-100/80 transition-colors font-semibold"
          >
            Go Back
          </button>
        </nav>
      </div>
    </main>
  );
}
