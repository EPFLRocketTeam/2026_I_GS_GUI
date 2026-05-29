import { useState } from "react";
import {
  createDragState,
  moveDraggedDisplay,
  resolveDroppedDisplay,
  getDraggedCardPosition,
} from "../pages/dashboard/dashboardUtils";
import { DigitalDisplay } from "../interfaces/dashboardInterfaces";
import { DEFAULT_PAN } from "../constants/gridConstants";

export function useDashboardDrag(
  setDisplays: React.Dispatch<React.SetStateAction<DigitalDisplay[]>>,
  gridPixelSize: number,
  pan: typeof DEFAULT_PAN = DEFAULT_PAN,
  zoom: number = 1,
) {
  const [dragging, setDragging] = useState<any>(null);

  const startDrag = (e: React.MouseEvent, display: any) => {
    const state = createDragState({ e, display, zoom, pan });
    if (state) setDragging(state);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const { x, y } = getDraggedCardPosition({ e, dragging, zoom, pan });

    setDisplays((prev: DigitalDisplay[]) =>
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
