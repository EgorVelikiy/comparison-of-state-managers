import { RecoilRoot } from "recoil";
import { RecoilDashboard } from "./recoil-dashboard/Dashboard";

export default function RecoilApp() {
  return (
    <RecoilRoot>
      <RecoilDashboard />
    </RecoilRoot>
  );
}
