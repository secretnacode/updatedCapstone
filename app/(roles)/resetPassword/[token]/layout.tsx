import { AuthBaseDesign } from "@/component/server_component/customComponent";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: Readonly<ReactNode>;
}>) {
  return <AuthBaseDesign isEnglish={false}>{children}</AuthBaseDesign>;
}
