import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: Readonly<ReactNode>;
}>) {
  return <div>{children}</div>;
}
