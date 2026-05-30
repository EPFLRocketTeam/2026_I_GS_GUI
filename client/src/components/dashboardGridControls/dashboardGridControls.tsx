import {
  GridSettings,
  GridProps,
} from "../../interfaces/gridInterfaces";
import "./dashboardGridControls.css";
import { GRID_SIZES, GRID_SETTINGS_KEYS } from "../../constants/gridConstants";

function DashboardGridControls({ gridSettings, setGridSettings }: Readonly<GridProps>) {
  const updateGrid = (changes: Partial<GridSettings>) => {
    setGridSettings((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  return (
    <button
      className="dashboard-grid-controls"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <label className="dashboard-grid-check">
        <input
          type="checkbox"
          checked={gridSettings.visible}
          onChange={(e) => updateGrid({ visible: e.target.checked })}
        />
        {GRID_SETTINGS_KEYS.grid}
      </label>

      <label>
        {GRID_SETTINGS_KEYS.size}
        <select
          value={gridSettings.size}
          onChange={(e) =>
            updateGrid({ size: e.target.value as keyof typeof GRID_SIZES })
          }
        >
          <option value="small">{GRID_SIZES.small.label}</option>
          <option value="medium">{GRID_SIZES.medium.label}</option>
          <option value="big">{GRID_SIZES.big.label}</option>
        </select>
      </label>
    </button>
  );
}

export default DashboardGridControls;
