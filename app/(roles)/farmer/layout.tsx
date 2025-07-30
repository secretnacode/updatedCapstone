import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavbarComponent />
      {children}
    </div>
  );
}
