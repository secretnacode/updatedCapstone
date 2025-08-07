import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <NavbarComponent />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
