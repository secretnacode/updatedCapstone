import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: Readonly<ReactNode>;
}>) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex">
        <NavbarComponent />

        <main className="flex-1 p-8">{children}</main>
      </div>
    </ClerkProvider>
  );
}
