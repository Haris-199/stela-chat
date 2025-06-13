import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, LoginError } from "../services/api";
import { User, Lock, X } from "lucide-react";
import { setItem } from "../services/localStorage";

export default function Login() {
  const [attempt, setAttempt] = useState<LoginError | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElements = e.target as HTMLFormElement;
    const attempt = await login(
      formElements["username"].value,
      formElements["password"].value,
    );

    if (attempt.success) {
      setItem("user", attempt.data);
      navigate("/chat");
    } else {
      setAttempt(attempt);
    }
  }

  return (
    <div className="grow w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 grid place-items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[90%] sm:w-[min(450px,50%)]">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Sign in to Stela
        </h1>
        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={18} />
              </span>
              <input
                id="username"
                name="username"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="user123"
                autoComplete="username"
                aria-invalid={attempt?.field === "username"}
              />
              {attempt?.field === "username" && (
                <span className="text-red-600 absolute inset-y-0 right-0 flex items-center pr-3">
                  <X />
                </span>
              )}
            </div>
            {attempt?.field === "username" && (
              <p className="mt-2 text-sm text-red-600">{attempt.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black-700 mb-1"
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
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="•••••••••"
                aria-invalid={attempt?.field === "password"}
              />
              {attempt?.field === "password" && (
                <span className="text-red-600 absolute inset-y-0 right-0 flex items-center pr-3">
                  <X />
                </span>
              )}
            </div>
            {attempt?.field === "password" && (
              <p className="mt-2 text-sm text-red-600">{attempt.message}</p>
            )}
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
