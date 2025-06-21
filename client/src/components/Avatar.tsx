export default function Avatar({
  imgURL,
  letter,
  size = 10,
}: {
  imgURL?: string;
  letter: string;
  size?: number;
}) {
  imgURL = `https://picsum.photos/400`;

  if (imgURL === undefined) {
    return (
      <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center font-bold text-white shadow`}>
        {letter}
      </div>
    );
  }

  return <img src={imgURL} className={`w-${size} h-${size} rounded-full shadow`} />;
}
