import { useState } from "react";
import {
  createDragState,
  moveDraggedDisplay,
  resolveDroppedDisplay,
  getDraggedCardPosition,
} from "../dashboardUtils";

export function useDashboardDrag(
  setDisplays: any,
  snapValue: any,
  zoom: number,
  pan: any,
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
        x: snapValue(x),
        y: snapValue(y),
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
