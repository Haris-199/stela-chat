import Spinner from "../components/Spinner";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 via-primary-300 to-primary-400 animate-fadeIn">
      <div className="bg-white flex flex-col justify-between items-center text-center shadow-lg rounded-lg p-8 pb-6 w-[90%] sm:w-[min(450px,60%)]">
        <div>
          <h1 className="text-3xl font-bold text-primary-700 mb-2">Loading...</h1>
          <p className="text-primary-600 text-lg">Please wait while we get things ready for you.</p>
        </div>
        <Spinner className="mt-3.75 size-10 text-primary-600 animate-spin" size={30} />
      </div>
    </div>
  );
}
