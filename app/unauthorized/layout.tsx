import { ReactElement, ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return <main>{children}</main>;
}
