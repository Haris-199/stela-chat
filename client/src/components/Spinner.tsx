import { LoaderCircle } from "lucide-react";

export default function Spinner({ size }: { size?: number }) {
  return <div className="animate-spin flex items-center justify-center text-primary"><LoaderCircle size={size}/></div>;
}
