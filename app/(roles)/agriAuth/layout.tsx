import { AuthBaseDesign } from "@/component/server_component/customComponent";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactElement, ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <ClerkProvider>
      <AuthBaseDesign isEnglish>{children}</AuthBaseDesign>
    </ClerkProvider>
  );
}
