import { clsx } from "clsx";

export default function Avatar({
  imgURL,
  letter,
  className,
}: {
  imgURL?: string;
  letter: string;
  className?: string;
}) {
  if (imgURL === undefined) {
    return (
      <div
        className={clsx(
          "rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center font-bold text-white shadow",
          className
        )}
      >
        {letter}
      </div>
    );
  }

  return <img src={imgURL} className={`rounded-full shadow ${className}`} />;
}
