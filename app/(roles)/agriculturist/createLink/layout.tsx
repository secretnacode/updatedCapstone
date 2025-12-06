import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavbarComponent forAgri={true} currentPage="Create Link">
        <main className="main-wrapper">{children}</main>
      </NavbarComponent>
    </>
  );
}
