import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";
import AuthContext from "../contexts/AuthContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import GuestButton from "../components/GuestButton";

export default function Home() {
  const { userData } = useContext(AuthContext);
  const userIsNotLoggedIn = userData === undefined;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-100 via-primary-200 to-primary-100">
      <Header userIsNotLoggedIn={userIsNotLoggedIn} />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center text-center md:text-left p-10 gap-1 md:gap-8">
        <div className="flex-1 flex flex-col items-center text-center">
          <h2 className="text-5xl font-extrabold md:ml-10 text-primary-800 drop-shadow-lg">
            Connect. Chat. Collaborate.
          </h2>
          <p className="text-lg text-primary-700 my-6 max-w-xl mx-auto md:mx-0">
            Stela Chat is the modern, secure, and fun way to stay in touch with your friends, team,
            or community. Share messages in a beautiful, real-time chat experience.
          </p>
          {userIsNotLoggedIn ? (
            <div className="flex flex-col gap-4 w-full items-center">
              <div className="flex flex-row flex-wrap gap-3 w-full justify-center">
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
                >
                  <UserPlus className="inline-block mr-1 w-5 h-5" />
                  Sign Up Now
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-8 py-3 bg-white text-primary-600 text-lg font-bold rounded-lg border border-primary-300 shadow hover:bg-primary-100/80 transition-colors"
                >
                  <LogIn className="inline-block mr-1 w-5 h-5" />
                  Sign In
                </Link>
              </div>
              <div className="text-primary-700 font-medium text-base mt-2">
                Or try Stela Chat without signing up:
              </div>
              <GuestButton className="self-center inline-block px-8 py-3 bg-primary-600 text-white text-lg font-bold rounded-lg shadow hover:bg-primary-700 transition-colors" />
            </div>
          ) : (
            <Link
              className="self-center inline-flex items-center gap-2 px-4 py-3 bg-primary-600 text-white text-lg font-bold rounded-lg shadow hover:bg-primary-700 transition-colors"
              to="/chat"
            >
              <LogIn className="w-5 h-5" />
              Your Chats
            </Link>
          )}
        </div>
        {/* Image Section - appears below text on mobile, right on md+ */}
        <div className="flex-1 flex justify-center items-center w-full mt-8 md:mt-0">
          {/* Wide image for xl screens */}
          <img
            src="https://placehold.co/600x400?text=Wide+Screenshot"
            alt="App screenshot wide"
            className="hidden xl:block rounded-2xl shadow-2xl border-4 border-primary-200 w-[clamp(500px,80%,800px)] h-auto object-cover"
          />
          {/* Medium image for md/lg screens */}
          <img
            src="https://placehold.co/400x300?text=Medium+Screenshot"
            alt="App screenshot medium"
            className="hidden md:block xl:hidden rounded-2xl shadow-2xl border-4 border-primary-200 w-[320px] h-auto object-cover"
          />
          {/* Small image for mobile screens */}
          <img
            src="https://placehold.co/150x200?text=Small+Screenshot"
            alt="App screenshot small"
            className="block md:hidden rounded-2xl shadow-xl border-4 border-primary-200 w-[220px] h-auto object-cover"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
