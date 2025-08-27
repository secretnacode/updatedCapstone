import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div>
      <div className=" w-full bg-red-300 text-red-950 flex justify-center items-center py-4">
        On production
      </div>
      {children}
    </div>
  );
}
