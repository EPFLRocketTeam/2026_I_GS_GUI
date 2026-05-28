import { GridSettings } from "../interfaces/gridInterfaces";
import { DigitalDisplay } from "../interfaces/dashboardInterfaces";

export type DashboardCanvasProps = {
    children: React.ReactNode;
    gridSettings: GridSettings;
    gridStyle?: React.CSSProperties;
};

export type DashboardContextMenuProps = {
    ctxMenu: any;
    closeMenu: () => void;
    onAddDisplay: (x: number, y: number) => void;  // TODO: improve typing, add boundaries
    onDeleteRequest: (id: string) => void;
}

export type DashboardDisplayProps = {
  display: DigitalDisplay;
  startDrag: (e: React.MouseEvent, display: DigitalDisplay) => void;
  onContextMenu?: (e: React.MouseEvent, display: DigitalDisplay) => void;
  dragging: any; // we can improve this later
  overlapping: boolean;
  gridPx: string;
  value: string | number;
};

export type DashboardDisplayFactoryProps = {
    display: DigitalDisplay;
    value: string | number;
    onContextMenu: (e: React.MouseEvent, display: DigitalDisplay) => void;
}

export type DashboardDisplayLayerProps = {
  displays: DigitalDisplay[];
  setDisplays: React.Dispatch<React.SetStateAction<any[]>>;
  gridPx: string;
  fieldValueMap: Map<string, string | number>;  // map of the radios connected to their variables
  zoom?: number;
  pan?: { x: number; y: number };
  onDisplayContextMenu?: (
    e: React.MouseEvent,
    display: any,
  ) => void;
};