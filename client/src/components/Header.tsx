import { LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSignout from "../hooks/useSignout";

export default function Header({ userIsNotLoggedIn }: { userIsNotLoggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const signout = useSignout();

  return (
    <header className="flex justify-center px-8 py-2.5 bg-white/80 shadow-md">
      <div className="w-[min(100%,2200px)] flex items-center justify-between">
        <h1 className="text-3xl filter-[hue-rotate(7deg)_saturate(79%)_brightness(92%)] text-[#1181fe] font-bold font-[Tahoma] tracking-wide grow pr-1">
          <img
            src="/logo.png"
            alt="App screenshot wide"
            className="inline-block w-9 h-auto object-cover mr-3 pb-1"
          />
          Stela Chat
        </h1>
        <nav className="text-primary-700 font-semibold">
          {/* Hamburger menu for small screens */}
          <div className="sm:hidden relative">
            <button
              className="p-2 rounded-lg hover:bg-primary-100/80 "
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="w-7 h-7" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-primary-200 z-50 flex flex-col">
                {userIsNotLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary-100/80 text-primary-700 rounded-t-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary-100/80 text-primary-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Register
                    </Link>
                  </>
                ) : (
                  <div>
                    <Link
                      to="/chat"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary-100/80 text-primary-700 rounded-t-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Your Chats
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary-100/80 text-primary-700 cursor-pointer"
                      onClick={() => {
                        signout();
                        setMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Buttons for sm+ screens */}
          <div className="hidden sm:flex gap-4 py-3.5">
            {userIsNotLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-3 bg-primary-600 text-white text-lg rounded-lg shadow hover:bg-primary-700 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white text-primary-600 rounded-lg border border-primary-300 shadow hover:bg-primary-100/80 transition-colors font-semibold"
                >
                  <UserPlus className="w-5 h-5" />
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex items-center gap-2 px-4 py-3 bg-primary-600 text-white text-lg rounded-lg shadow hover:bg-primary-700 transition-colors"
                  to="/chat"
                >
                  <LogIn className="w-5 h-5" />
                  Your Chats
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white text-primary-600 rounded-lg border border-primary-300 shadow hover:bg-primary-100/80 transition-colors font-semibold"
                  onClick={() => signout()}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
