import React, { useMemo } from "react";
import { useDashboardDrag } from "../../hooks/useDashboardDrag";
import { getOverlappingCardIds, getDisplayValue } from "../../pages/dashboard/dashboardUtils";
import { DashboardDisplay } from "../dashboardDisplay/dashboardDisplay";
import { DEFAULT_PAN, GRID_SIZES } from "../../constants/gridConstants";
import "./dashboardDisplayLayer.css";
import { DashboardDisplayLayerProps } from "../../types/types";

function DashboardDisplayLayer(
  {
    displays,
    setDisplays,
    gridPx,
    fieldValueMap,
    zoom = 1,
    pan = DEFAULT_PAN,
    onDisplayContextMenu,
  }: Readonly<DashboardDisplayLayerProps>,
) {
  const gridPixelSize = gridPx ??
    GRID_SIZES.medium;   // TODO: could be problematic for size of grid

  const { dragging, startDrag, onDragMove, stopDrag } =
    useDashboardDrag(setDisplays, gridPixelSize, pan, zoom);

  const overlappingCardIds = useMemo(
    () => getOverlappingCardIds(displays),
    [displays],
  );

  return (
    <button
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
          gridSize={gridPx}
          value={getDisplayValue(fieldValueMap, display)}
        />
      ))}
    </button>
  );
}

export default DashboardDisplayLayer;