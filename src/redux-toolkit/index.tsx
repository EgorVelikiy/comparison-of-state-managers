import { Provider as ReduxProvider } from "react-redux";
import { ReduxDashboard } from "./redux-dashboard/Dashboard";
import { store } from "./state/store";

export default function ReduxToolkitApp() {
  return (
    <ReduxProvider store={store}>
      <ReduxDashboard />
    </ReduxProvider>
  );
}
