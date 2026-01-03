import { AgriAuth } from "@/component/client_component/authComponent";
import { LoadingScreen } from "@/component/server_component/customComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Fallback page where it will check the user who is currently logged-in in clerk auth",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div>
      <LoadingScreen />
      <AgriAuth />
    </div>
  );
}
