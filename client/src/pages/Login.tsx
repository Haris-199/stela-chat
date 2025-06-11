import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="grow w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 grid place-items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[90%] sm:w-[min(450px,50%)]">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Sign in to Stela
        </h1>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="user123"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="•••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-black-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
