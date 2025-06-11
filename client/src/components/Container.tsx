import { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
