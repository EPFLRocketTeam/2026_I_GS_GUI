import { GridSettings } from "../interfaces/gridInterfaces";

export const GRID_SIZES = {
  small: { px: 30, label: "Small" },
  medium: { px: 22, label: "Medium" },
  big: { px: 18, label: "Big" },
} as const;

export const DEFAULT_GRID_SETTINGS: GridSettings = {
  visible: true,
  size: "medium",
  major: 5,
  opacity: 0.2,
};

export const enum GRID_SETTINGS_KEYS {
  grid = "grid",
  size = "size",
  major = "major",
  opacity = "opacity",
}

export const CARD_W = 5;
export const CARD_H = 5;
export const CARD_GAP = 18;

export const GRID_WIDTH = 1000;
export const GRID_HEIGHT = 540;

export const DEFAULT_PAN = { x: 0, y: 0 };