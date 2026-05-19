import { useState, useRef } from "react";

export function useDashboardPan(
  clampPan?: (nextPan: { x: number; y: number }) => { x: number; y: number },
) {
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

    const nextPan = {
      x: panning.startPanX + (e.clientX - panning.startMouseX),
      y: panning.startPanY + (e.clientY - panning.startMouseY),
    };

    setPan(clampPan ? clampPan(nextPan) : nextPan);
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
