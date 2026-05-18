import {
  GridSettings,
  GridProps,
} from "../../interfaces/gridInterfaces/gridInterfaces";
import "./dashboardGridControls.css";
import { GRID_SIZES } from "../../constants/gridConstants/gridConstants";
import { GridMajorLevels, GridOpacityLevels } from "./gridUtils";

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
        GridSettingsKeys.grid{" "}
      </label>

      <label className="dashboard-grid-check">
        <input
          type="checkbox"
          checked={gridSettings.snap}
          onChange={(e) => updateGrid({ snap: e.target.checked })}
        />
        GridSettingsKeys.snap{" "}
      </label>

      <label>
        GridSettingsKeys.size{" "}
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
        <span>{GRID_SIZES[gridSettings.size].px}px</span>
      </label>

      <label>
        GridSettingsKeys.major{" "}
        <input
          type="range"
          min={GridMajorLevels.low}
          max={GridMajorLevels.high}
          step="1"
          value={gridSettings.major}
          onChange={(e) => updateGrid({ major: Number(e.target.value) })}
        />
        <span>{gridSettings.major}x</span>
      </label>

      <label>
        GridSettingsKeys.opacity{" "}
        <input
          type="range"
          min={GridOpacityLevels.low}
          max={GridOpacityLevels.high}
          step="0.01"
          value={gridSettings.opacity}
          onChange={(e) => updateGrid({ opacity: Number(e.target.value) })}
        />
      </label>
    </button>
  );
}

export default DashboardGridControls;
