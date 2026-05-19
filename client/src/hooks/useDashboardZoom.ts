import {
  useCallback,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { getNextZoomPan } from "../pages/dashboard/dashboardUtils";

export function useDashboardZoom(
  setPan?: Dispatch<SetStateAction<{ x: number; y: number }>>,
  clampPan?: (
    nextPan: { x: number; y: number },
    zoomValue: number,
  ) => { x: number; y: number },
) {
  const [zoom, setZoom] = useState(1);
  const mouseRef = useRef({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });

  const zoomAround = useCallback(
    (delta: number) => {
      setZoom((prev) => {
        const { zoom: nextZoom, pan: nextPan } = getNextZoomPan({
          mouseX: mouseRef.current.x,
          mouseY: mouseRef.current.y,
          zoom: prev,
          pan: panRef.current,
          delta,
        });

        const boundedPan = clampPan ? clampPan(nextPan, nextZoom) : nextPan;
        panRef.current = boundedPan;
        if (setPan) setPan(boundedPan);
        return nextZoom;
      });
    },
    [clampPan, setPan],
  );

  const handleWheel = useCallback(
    (e: WheelEvent | React.WheelEvent) => {
      if (!e.ctrlKey) return;

      e.preventDefault();

      zoomAround(e.deltaY < 0 ? 0.1 : -0.1);
    },
    [zoomAround],
  );

  const resetZoom = () => setZoom(1);

  return {
    zoom,
    setZoom,
    zoomAround,
    resetZoom,
    mouseRef,
    panRef,
    handleWheel,
  };
}
