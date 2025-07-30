import { LoadingManager } from "@/component/client_component/provider/loadingProvider";

export default function Page() {
  console.log(`farmer main component`);
  return (
    <div>
      <LoadingManager />
      main page / home page
    </div>
  );
}
