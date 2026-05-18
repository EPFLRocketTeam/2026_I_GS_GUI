import { GridSettings } from "../../interfaces/gridInterfaces/gridInterfaces";
import { GRID_SIZES } from "../../constants/gridConstants/gridConstants";

export const snapToGridValue = (
  value: number,
  gridSettings: GridSettings,
  zoom = 1,
): number => {
  if (!gridSettings.snap) return value;
  const gridPx = GRID_SIZES[gridSettings.size].px;
  // value is in world units; convert to screen px with zoom, snap, then convert back
  return (
    Math.round((value * zoom) / gridPx) * (gridPx / zoom)
  );
};

export const buildGridCssVars = (
  gridSettings: GridSettings,
  zoom: number,
  pan: { x: number; y: number },
) => {
  const minorSize = Math.max(GRID_SIZES[gridSettings.size].px * zoom, 2);
  const majorSize = Math.max(
    GRID_SIZES[gridSettings.size].px * gridSettings.major * zoom,
    2,
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
  } as React.CSSProperties;
};

export const enum GridSettingsKeys {
  grid = "grid",
  snap = "snap",
  size = "size",
  major = "major",
  opacity = "opacity",
}

export const enum GridOpacityLevels {
  low = 0.04,
  medium = 0.18,
  high = 0.35,
}

export const enum GridMajorLevels {
  low = 2,
  medium = 5,
  high = 10,
}
