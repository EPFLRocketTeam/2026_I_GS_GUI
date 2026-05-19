import { useState } from "react";
import {
  createDragState,
  moveDraggedDisplay,
  resolveDroppedDisplay,
  getDraggedCardPosition,
} from "../pages/dashboard/dashboardUtils";

export function useDashboardDrag(
  setDisplays: any,
  zoom: number = 1,
  pan: any = { x: 0, y: 0 },
  gridPixelSize: number = 22,
) {
  const [dragging, setDragging] = useState<any>(null);

  const startDrag = (e: React.MouseEvent, display: any) => {
    const state = createDragState({ e, display, zoom, pan });
    if (state) setDragging(state);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const { x, y } = getDraggedCardPosition({ e, dragging, zoom, pan });

    setDisplays((prev: any) =>
      moveDraggedDisplay({
        displays: prev,
        dragging,
        x,
        y,
        gridPixelSize,
      }),
    );
  };

  const stopDrag = () => {
    if (!dragging) return;

    setDisplays((prev: any) =>
      resolveDroppedDisplay({
        displays: prev,
      }),
    );

    setDragging(null);
  };

  return {
    dragging,
    startDrag,
    onDragMove,
    stopDrag,
  };
}
