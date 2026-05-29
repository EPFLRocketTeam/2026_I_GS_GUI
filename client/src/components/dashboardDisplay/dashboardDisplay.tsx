import { getCardWidth, getCardHeight } from "../../pages/dashboard/dashboardUtils";
import { GRID_SIZES } from "../../constants/gridConstants";
import DashboardDisplayFactory from "../dashboardDisplayFactory/dashboardDisplayFactory";
import "./dashboardDisplay.css";
import { DashboardDisplayProps } from "../../types/types";

export function DashboardDisplay({
  display,
  startDrag,
  onContextMenu,
  dragging,
  overlapping,
  gridSize,
  value,
}: Readonly<DashboardDisplayProps>) {
  const gridPixelSize = gridSize || GRID_SIZES.medium.px;
  const width = getCardWidth(gridPixelSize);
  const height = getCardHeight(gridPixelSize);

  const posX = display.posx ?? 0;
  const posY = display.posy ?? 0;

  return (
    <button
      type="button"
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
    </button>
  );
}