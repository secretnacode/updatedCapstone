import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: Readonly<ReactNode>;
}>) {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
