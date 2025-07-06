import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { Lock, X, User2 } from "lucide-react";
import { setItem } from "../services/localStorage";
import AuthContext from "../contexts/AuthContext";
import { LoginError } from "../types";

export default function Login() {
  const [attempt, setAttempt] = useState<LoginError>();
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElements = e.target as HTMLFormElement;
    const attempt = await login(formElements["username"].value, formElements["password"].value);

    if (attempt.success) {
      setItem("user", attempt.data);
      setUserData(attempt.data);
      navigate("/chat");
    } else {
      setAttempt(attempt);
    }
  }

  return (
    <main className="grow w-full py-4 bg-gradient-to-br from-primary-200 to-primary-400 grid place-items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[90%] sm:w-[min(450px,60%)]">
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">Sign in to Stela</h1>
        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User2 size={18} />
              </span>
              <input
                id="username"
                name="username"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="user123"
                autoComplete="username"
                aria-invalid={!!attempt && attempt.errors.username.length > 0}
                aria-describedby="username-error"
              />
              {attempt && attempt.errors.username.length > 0 && (
                <span className="text-red-600 absolute inset-y-0 right-0 flex items-center pr-3">
                  <X />
                </span>
              )}
            </div>
            {attempt && attempt.errors.username.length > 0 && (
              <p
                id="username-error"
                aria-live="polite"
                aria-atomic="true"
                className="mt-2 text-sm text-red-600"
              >
                {attempt.errors.username[0]}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black-700 mb-1">
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
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="••••••••••"
                aria-invalid={!!attempt && attempt.errors.password.length > 0}
                aria-describedby="password-error"
              />
              {attempt && attempt.errors.password.length > 0 && (
                <span className="text-red-600 absolute inset-y-0 right-0 flex items-center pr-3">
                  <X />
                </span>
              )}
            </div>
            {attempt && attempt.errors.password.length > 0 && (
              <p
                id="password-error"
                aria-live="polite"
                aria-atomic="true"
                className="mt-2 text-sm text-red-600"
              >
                {attempt.errors.password[0]}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-black-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 hover:underline font-medium">
            Register
          </Link>
        </p>
        <div className="mt-4 border-t">
          <h2 className="text-lg font-semibold text-center text-primary-700 py-3">Try now</h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Want to explore without signing up? Sign in as a guest!
          </p>
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
    </main>
  );
}
