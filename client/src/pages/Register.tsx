import { Lock, User2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="grow w-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-primary-400">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[90%] sm:w-[min(450px,60%)]">
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">
          Create your account
        </h1>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User2 size={18} />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Choose a username"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Your password must contain at least:</p>
            <ul className="mt-2 text-xs text-gray-500 list-disc mx-4 space-y-1">
              <li>Eight characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One digit</li>
              <li>One special character <span className="font-mono">{"(!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~)"}</span></li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
        <div className="mt-4 border-t">
          <h2 className="text-lg font-semibold text-center text-primary-700 py-3">Try now</h2>
          <p className="text-sm text-gray-600 text-center mb-4">Want to explore without signing up? Sign in as a guest!</p>
          <div className="flex justify-center">
            <button
              type="button"
              className="py-2 px-6 bg-gray-200 hover:bg-primary-100 text-primary-700 font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors"
              onClick={() => console.log("Feature coming soon")}
            >
              Sign in as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
