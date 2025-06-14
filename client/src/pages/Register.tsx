import { Lock, User2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, RegisterError } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<RegisterError | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElements = e.target as HTMLFormElement;
    const attempt = await register(
      formElements["username"].value,
      formElements["password"].value
    );

    if (attempt.success) {
      navigate("/login");
    } else {
      setAttempt(attempt);
    }
  }

  return (
    <div className="grow w-full py-4 flex items-center justify-center bg-gradient-to-br from-blue-200 to-primary-400">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[90%] sm:w-[min(450px,60%)]">
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">
          Create your account
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
                id="username"
                name="username"
                required
                className="w-full pl-10 pr-11 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Choose a username"
                autoComplete="username"
                aria-invalid={!!(attempt && attempt.errors.username.length > 0)}
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
                aria-invalid={!!(attempt && attempt.errors.username.length > 0)}
                aria-describedby="password-error"
              />
              {attempt && attempt.errors.username.length > 0 && (
                <span className="text-red-600 absolute inset-y-0 right-0 flex items-center pr-3">
                  <X />
                </span>
              )}
            </div>
            {attempt && attempt.errors.username.length > 0 && (
              <div
                id="password-error"
                aria-live="polite"
                aria-atomic="true"
                className="mt-2 text-sm text-red-600"
              >
                {attempt.errors.password.map((msg) => (
                  <p className="mt-2 text-sm text-red-600">{msg}</p>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Your password must contain at least:
            </p>
            <ul className="mt-2 text-xs text-gray-500 list-disc mx-4 space-y-1">
              <li>Eight characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One digit</li>
              <li>
                One special character{" "}
                <span className="font-mono">
                  {"(!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~)"}
                </span>
              </li>
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
          <h2 className="text-lg font-semibold text-center text-primary-700 py-3">
            Try now
          </h2>
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
    </div>
  );
}
