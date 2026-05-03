import "./dashboardGridControls.css";

export const DEFAULT_GRID_SETTINGS = {
  visible: true,
  snap: true,
  size: 24,
  majorEvery: 5,
  opacity: 0.18,
};

export const snapToGridValue = (value, gridSettings) => {
  if (!gridSettings.snap) return value;
  return Math.round(value / gridSettings.size) * gridSettings.size;
};

export const buildGridCssVars = (gridSettings, zoom, pan) => {
  const minorSize = Math.max(gridSettings.size * zoom, 2);
  const majorSize = Math.max(
    gridSettings.size * gridSettings.majorEvery * zoom,
    2
  );

  return {
    "--grid-size": `${minorSize}px`,
    "--grid-major-size": `${majorSize}px`,
    "--grid-x": `${pan.x}px`,
    "--grid-y": `${pan.y}px`,
    "--grid-line": gridSettings.visible
      ? `rgba(255, 255, 255, ${gridSettings.opacity})`
      : "transparent",
    "--grid-major-line": gridSettings.visible
      ? `rgba(255, 255, 255, ${Math.min(gridSettings.opacity + 0.12, 0.35)})`
      : "transparent",
  };
};

function DashboardGridControls({ gridSettings, setGridSettings }) {
  const updateGrid = (changes) => {
    setGridSettings((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  return (
    <div
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
        Grid
      </label>

      <label className="dashboard-grid-check">
        <input
          type="checkbox"
          checked={gridSettings.snap}
          onChange={(e) => updateGrid({ snap: e.target.checked })}
        />
        Snap
      </label>

      <label>
        Size
        <input
          type="range"
          min="8"
          max="80"
          step="2"
          value={gridSettings.size}
          onChange={(e) => updateGrid({ size: Number(e.target.value) })}
        />
        <span>{gridSettings.size}px</span>
      </label>

      <label>
        Major
        <input
          type="range"
          min="2"
          max="10"
          step="1"
          value={gridSettings.majorEvery}
          onChange={(e) => updateGrid({ majorEvery: Number(e.target.value) })}
        />
        <span>{gridSettings.majorEvery}x</span>
      </label>

      <label>
        Opacity
        <input
          type="range"
          min="0.04"
          max="0.35"
          step="0.01"
          value={gridSettings.opacity}
          onChange={(e) => updateGrid({ opacity: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}

export default DashboardGridControls;