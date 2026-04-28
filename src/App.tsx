import { useState, ChangeEvent } from "react";
import { StateManagerType } from "./types";
import ReduxToolkitApp from "./redux-toolkit";
import RecoilApp from "./recoil";
import ValtioApp from "./valtio";
import MobXApp from "./mobx";
import "./styles.css";

export default function App() {
  const [stateManager, setStateManager] = useState<StateManagerType>("redux");

  // Обработчик переключения state manager
  const handleStateManagerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newManager = e.target.value as StateManagerType;
    setStateManager(newManager);
  };

  // Получение счетчиков ререндеров для отображения

  // Рендеринг Dashboard в зависимости от выбранного state manager
  const renderDashboard = () => {
    switch (stateManager) {
      case "redux":
        return <ReduxToolkitApp />;
      case "mobx":
        return <MobXApp />;
      case "recoil":
        return <RecoilApp />;
      case "valtio":
        return <ValtioApp />;
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="app-header">
        <h1>React State Managers Comparison</h1>
        <div className="state-manager-selector">
          <label htmlFor="state-manager">State Manager:</label>
          <select
            id="state-manager"
            value={stateManager}
            onChange={handleStateManagerChange}
          >
            <option value="redux">Redux Toolkit</option>
            <option value="mobx">MobX</option>
            <option value="recoil">Recoil</option>
            <option value="valtio">Valtio</option>
          </select>
        </div>
      </header>

      {renderDashboard()}
    </div>
  );
}
