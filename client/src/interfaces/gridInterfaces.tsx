import { GRID_SIZES } from "../constants/gridConstants";

export type GridSizePreset = keyof typeof GRID_SIZES;

export interface GridSettings {
  visible: boolean;
  size: GridSizePreset;
  major: number;
  opacity: number;
}

export interface GridProps {
  gridSettings: GridSettings;
  setGridSettings: React.Dispatch<React.SetStateAction<GridSettings>>;
}