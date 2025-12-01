import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { ProtectedAction } from "@/lib/protectedActions";
import { SessionValueType } from "@/types";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: Readonly<ReactNode>;
}>) {
  let val: SessionValueType;

  try {
    val = await ProtectedAction("read:farmer:profile");
  } catch (error) {
    console.error((error as Error).message);
    val = { userId: "", work: "farmer" };
  }
  return (
    <ClerkProvider>
      <div className="min-h-screen flex">
        <NavbarComponent
          currentPage={"Frmer Profile"}
          forAgri={val.work === "admin" || val.work === "agriculturist"}
        >
          <main className="flex-1 p-8">{children}</main>
        </NavbarComponent>
      </div>
    </ClerkProvider>
  );
}
