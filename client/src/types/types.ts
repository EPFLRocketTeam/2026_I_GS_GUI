import { GridSettings } from "../interfaces/gridInterfaces";
import { DigitalDisplay } from "../interfaces/dashboardInterfaces";
import { CONTEXT_MENU_TYPES } from "../constants/contextMenuConstants";
import {DeleteModalText} from "../constants/deleteModalConstants";

export type DashboardCanvasProps = {
    children: React.ReactNode;
    gridSettings: GridSettings;
    gridStyle?: React.CSSProperties;
};

export type DashboardContextMenuProps = {
    ctxMenu: DashboardContextMenuState | null;
    closeMenu: () => void;
    onAddDisplay: (x: number, y: number) => void;  // TODO: improve typing, add boundaries
    onDeleteRequest: (id: string) => void;
}

export type DashboardDisplayProps = {
  display: DigitalDisplay;
  startDrag: (e: React.MouseEvent, display: DigitalDisplay) => void;
  onContextMenu?: (e: React.MouseEvent, display: DigitalDisplay) => void;
  dragging: {digitalDisplayId: string} | null; // TODO: stronger typing here
  overlapping: boolean;
  gridSize: number;
  value: string | number; // this represents the value of the variable shown in the display
};

export type DashboardDisplayFactoryProps = {
    display: DigitalDisplay;
    value: string | number;
    onContextMenu: (e: React.MouseEvent, display: DigitalDisplay) => void;
}

export type DashboardDisplayLayerProps = {
  displays: DigitalDisplay[];
  setDisplays: React.Dispatch<React.SetStateAction<DigitalDisplay[]>>;
  gridPx: number;
  fieldValueMap: Map<string, string | number>;  // map of the radios connected to their variables
  zoom?: number;
  pan?: { x: number; y: number };
  onDisplayContextMenu?: (
    e: React.MouseEvent,
    display: any,
  ) => void;
};

export type DashboardViewportProps = {
    children: React.ReactNode;
    gridSettings: GridSettings;
    zoom?: number;
    pan?: { x: number; y: number };
    panning?: boolean;
    style?: React.CSSProperties;
} & DashboardViewportEvents;

export type DashboardContextMenuState =
  | {
      type: CONTEXT_MENU_TYPES.page;
      x: number;
      y: number;
      canvasX: number;
      canvasY: number;
    }
  | {
      type: CONTEXT_MENU_TYPES.card;
      x: number;
      y: number;
      displayId: string;
    };

export type DeleteModalProps = {
  radio: any;
  index: number;
  itemName: string;
  title: string;
  message: string;
  confirmText: DeleteModalText;
  cancelText: DeleteModalText;
  onConfirm: () => void;
  onCancel: () => void;
};

type DashboardViewportEvents = {
  onContextMenu?: (e: DivMouseEvent) => void;
  onMouseDown?: (e: DivMouseEvent) => void;
  onMouseMove?: (e: DivMouseEvent) => void;
  onMouseUp?: (e: DivWheelEvent) => void;
  onMouseLeave?: (e: DivMouseEvent) => void;
  onWheel?: (e: DivWheelEvent) => void;
};

type DivMouseEvent = React.MouseEvent<HTMLDivElement>;
type DivWheelEvent = React.WheelEvent<HTMLDivElement>;