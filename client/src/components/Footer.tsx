export default function Footer() {
  return (
    <footer className="mt-auto py-6 text-center text-primary-600 bg-white/80 shadow-inner">
      &copy; {new Date().getFullYear()} Stela Chat. Built with ❤️.
      <br />
      <span className="block mt-2 text-sm text-primary-500">
        Powered by{" "}
        <a
          href="https://react.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline hover:text-primary-700"
        >
          React
        </a>
        ,{" "}
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline hover:text-primary-700"
        >
          Tailwind CSS
        </a>
        , and{" "}
        <a
          href="https://expressjs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline hover:text-primary-700"
        >
          Express
        </a>
        .
      </span>
    </footer>
  );
}
