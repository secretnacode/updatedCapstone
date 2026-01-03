import { ReactElement, ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Sign up page where the user who will sign up in here will be automatically agriculturist",
  robots: { index: false, follow: false },
};

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return <div>{children}</div>;
}
