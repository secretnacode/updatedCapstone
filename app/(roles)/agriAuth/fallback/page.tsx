import { AgriAuth } from "@/component/client_component/authComponent";
import { LoadingScreen } from "@/component/server_component/customComponent";

export default function Page() {
  return (
    <div>
      <LoadingScreen />
      <AgriAuth />
    </div>
  );
}
