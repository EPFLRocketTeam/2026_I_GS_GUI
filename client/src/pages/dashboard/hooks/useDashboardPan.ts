import { useState, useRef, useCallback } from "react";

export function useDashboardPan() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState<null | {
    startMouseX: number;
    startMouseY: number;
    startPanX: number;
    startPanY: number;
  }>(null);

  const panRef = useRef(pan);

  const startPan = (e: React.MouseEvent) => {
    if (e.button !== 2 || !e.ctrlKey) return;

    setPanning({
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    });
  };

  const onPanMove = (e: React.MouseEvent) => {
    if (!panning) return;

    setPan({
      x: panning.startPanX + (e.clientX - panning.startMouseX),
      y: panning.startPanY + (e.clientY - panning.startMouseY),
    });
  };

  const stopPan = () => setPanning(null);

  return {
    pan,
    setPan,
    panning,
    startPan,
    onPanMove,
    stopPan,
    panRef,
  };
}
