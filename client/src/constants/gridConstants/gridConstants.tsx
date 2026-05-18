import { GridSettings } from "../../interfaces/gridInterfaces/gridInterfaces";

export const GRID_SIZES = {
  small: { px: 12, label: "Small" },
  medium: { px: 24, label: "Medium" },
  big: { px: 48, label: "Big" },
} as const;

export const DEFAULT_GRID_SETTINGS: GridSettings = {
  visible: true,
  snap: true,
  size: "medium",
  major: 5,
  opacity: 0.18,
};
