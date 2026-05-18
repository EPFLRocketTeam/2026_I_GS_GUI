import { GridSettings } from "../../interfaces/gridInterfaces/gridInterfaces";
import { GRID_SIZES } from "../../constants/gridConstants/gridConstants";

export const snapToGridValue = (
  value: number,
  gridSettings: GridSettings,
  zoom = 1,
): number => {
  const gridPx = GRID_SIZES[gridSettings.size].px;
  return Math.round((value * zoom) / gridPx) * (gridPx / zoom);
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
  size = "size",
  major = "major",
  opacity = "opacity",
}
