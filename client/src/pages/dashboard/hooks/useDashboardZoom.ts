import { useCallback, useRef, useState } from "react";
import { getNextZoomPan } from "../dashboardUtils";

export function useDashboardZoom() {
  const [zoom, setZoom] = useState(1);
  const mouseRef = useRef({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });

  const zoomAround = useCallback((delta: number) => {
    setZoom((prev) => {
      const { zoom: nextZoom, pan: nextPan } = getNextZoomPan({
        mouseX: mouseRef.current.x,
        mouseY: mouseRef.current.y,
        zoom: prev,
        pan: panRef.current,
        delta,
      });

      panRef.current = nextPan;
      return nextZoom;
    });
  }, []);

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
