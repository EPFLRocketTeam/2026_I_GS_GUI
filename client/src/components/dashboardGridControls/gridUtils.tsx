import { GridSettings } from "../../interfaces/gridInterfaces";
import { GRID_SIZES } from "../../constants/gridConstants";

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
      ? `rgba(0, 255, 208, ${gridSettings.opacity})` // css must be dynamically set since it depends on function variables
      : "transparent",

    "--grid-major-line": gridSettings.visible
      ? `rgba(0, 255, 208, ${Math.min(gridSettings.opacity + 0.1, 0.45)})`
      : "transparent",
  } as React.CSSProperties;
};

export const enum GridSettingsKeys {
  grid = "grid",
  size = "size",
  major = "major",
  opacity = "opacity",
}
