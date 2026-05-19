import React, { useMemo } from "react";
import { useDashboardDrag } from "../../hooks/useDashboardDrag";
import { getOverlappingCardIds, getDisplayValue } from "../../pages/dashboard/dashboardUtils";
import { DashboardDisplay } from "../dashboardDisplay/dashboardDisplay";
import { GRID_SIZES } from "../../constants/gridConstants";
import "./dashboardDisplayLayer.css";

type DashboardDisplayLayerProps = {
  displays: any[];
  setDisplays: React.Dispatch<React.SetStateAction<any[]>>;
  gridPx: string;
  fieldValueMap: Map<string, string | number>;
  zoom?: number;
  pan?: { x: number; y: number };
  onDisplayContextMenu?: (
    e: React.MouseEvent,
    display: any,
  ) => void;
};

function DashboardDisplayLayer(
  {
    displays,
    setDisplays,
    gridPx,
    fieldValueMap,
    zoom = 1,
    pan = { x: 0, y: 0 },
    onDisplayContextMenu,
  }: Readonly<DashboardDisplayLayerProps>,
) {
  const gridPixelSize = GRID_SIZES[gridPx as keyof typeof GRID_SIZES]?.px ??
    GRID_SIZES.medium.px;

  const { dragging, startDrag, onDragMove, stopDrag } =
    useDashboardDrag(setDisplays, zoom, pan, gridPixelSize);

  const overlappingCardIds = useMemo(
    () => getOverlappingCardIds(displays),
    [displays],
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="dashboard-display-layer"
      onMouseMove={onDragMove}
      onMouseUp={stopDrag}
    >
      {displays.map((display) => (
        <DashboardDisplay
          key={display.digitalDisplayId}
          display={display}
          dragging={dragging}
          startDrag={startDrag}
          onContextMenu={onDisplayContextMenu}
          overlapping={overlappingCardIds.has(
            display.digitalDisplayId,
          )}
          gridPx={gridPx}
          value={getDisplayValue(fieldValueMap, display)}
        />
      ))}
    </div>
  );
}

export default DashboardDisplayLayer;