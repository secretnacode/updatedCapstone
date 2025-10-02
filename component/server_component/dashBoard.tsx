import { getFarmerLeadDashboardData } from "@/lib/server_action/user";
import { DashboardCard } from "./customComponent";
import { Clipboard } from "lucide-react";
import { LineChartComponent } from "../client_component/componentForAllUser";

export const FarmerLeadDashBoard = async () => {
  await getFarmerLeadDashboardData();
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <div className="grid grid-cols-3">
          <DashboardCard
            title="Bilang ng report ngayon"
            logo={Clipboard}
            content={<p>5</p>}
            linkLabel={"Ipinasang Ulat"}
            link={`/farmer/validateReport`}
          />

          <DashboardCard
            title="Bilang ng unvalidated na ulat"
            logo={Clipboard}
            content={<p>5</p>}
            linkLabel={"Ipinasang Ulat"}
            link={`/farmer/validateReport`}
          />
        </div>

        {/* <LineChartComponent
          title="Bilang ng ulat ngayong lingo"
          description="Bilang ng mga report sa lingong ito"
        /> */}
      </div>
      <div></div>
    </div>
  );
};

export const FarmerDashBoard = () => {
  return <div>farmer</div>;
};
