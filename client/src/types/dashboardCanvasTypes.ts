import { GridSettings } from "../interfaces/gridInterfaces";

export type DashboardCanvasProps = {
    children: React.ReactNode;
    gridSettings: GridSettings;
    gridStyle?: React.CSSProperties;
};

export type DashboardContextMenuProps = {
    ctxMenu: any;
    closeMenu: () => void;
    onAddDisplay: (x: number, y: number) => void;
    onDeleteRequest: (id: string) => void;
}