import { Link, useNavigate } from "react-router-dom";
import { Ghost } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function NotFound() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 via-primary-300 to-primary-400">
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl bg-white">
        <h1 className="text-6xl font-extrabold text-primary-700 mb-2">404</h1>
        <p className="text-xl text-primary-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Ghost className="w-20 h-20 text-primary-400 mt-3 mb-5 animate-bounce" />
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
