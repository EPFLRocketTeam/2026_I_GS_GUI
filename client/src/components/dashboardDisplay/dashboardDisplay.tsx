import { getCardWidth, getCardHeight } from "../../pages/dashboard/dashboardUtils";
import { GRID_SIZES } from "../../constants/gridConstants";
import DashboardDisplayFactory from "../dashboardDisplayFactory/dashboardDisplayFactory";
import { DigitalDisplay } from "../../interfaces/dashboardInterfaces";
import "./dashboardDisplay.css";

type Props = {
  display: DigitalDisplay;
  startDrag: (e: React.MouseEvent, display: DigitalDisplay) => void;
  onContextMenu?: (e: React.MouseEvent, display: DigitalDisplay) => void;
  dragging: any; // we can improve this later
  overlapping: boolean;
  gridPx: string;
  value: string | number;
};

export function DashboardDisplay({
  display,
  startDrag,
  onContextMenu,
  dragging,
  overlapping,
  gridPx,
  value,
}: Readonly<Props>) {
  // Convert grid size identifier to pixel value
  const gridPixelSize = GRID_SIZES[gridPx as keyof typeof GRID_SIZES]?.px || GRID_SIZES.medium.px;
  const width = getCardWidth(gridPixelSize);
  const height = getCardHeight(gridPixelSize);

  // Position in pixels
  const posX = display.posx ?? 0;
  const posY = display.posy ?? 0;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`dashboard-draggable-card ${
        dragging?.digitalDisplayId === display.digitalDisplayId
          ? "is-dragging"
          : ""
      } ${overlapping ? "is-overlapping" : ""}`}
      data-card="true"
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseDown={(e) => startDrag(e, display)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(e, display);
      }}
    >
      <DashboardDisplayFactory
        display={display}
        value={value}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.(e, display);
        }}
      />
    </div>
  );
}