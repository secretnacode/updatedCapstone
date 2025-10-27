import { AuthBaserDesign } from "@/component/server_component/customComponent";
import { ReactElement, ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return <AuthBaserDesign>{children}</AuthBaserDesign>;
}
