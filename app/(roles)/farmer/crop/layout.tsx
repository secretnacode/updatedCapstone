import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavbarComponent forAgri={false} currentPage="Pananim" />

      <main className="flex-1 p-8">{children}</main>
    </>
  );
}
