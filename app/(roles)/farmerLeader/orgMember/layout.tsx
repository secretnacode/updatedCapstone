import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: Readonly<ReactNode>;
}>) {
  return (
    <NavbarComponent forAgri={false} currentPage="Mga miyembro">
      <main className="main-wrapper">{children}</main>
    </NavbarComponent>
  );
}
