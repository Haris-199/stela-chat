import { LoaderCircle } from "lucide-react";

export default function Spinner({ size=18, className }: { size?: number, className?: string }) {
  return (
    <div className={"animate-spin rounded-full flex items-center justify-center text-primary" + className}>
      <LoaderCircle size={size} />
    </div>
  );
}
