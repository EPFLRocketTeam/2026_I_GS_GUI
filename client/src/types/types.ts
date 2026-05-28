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
    onAddDisplay: (x: number, y: number) => void;  // improve typing, add boundaries
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