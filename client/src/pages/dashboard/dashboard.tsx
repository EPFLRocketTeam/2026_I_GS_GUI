import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { DigitalDisplay, DigitalDisplayProps } from "../../interfaces/dashboardInterfaces";
import {
  buildFieldValueMap,
  createDisplayFromField,
} from "./dashboardUtils";
import {
  DEFAULT_GRID_SETTINGS,
  GRID_WIDTH,
  GRID_HEIGHT,
} from "../../constants/gridConstants";
import DashboardGridControls from "../../components/dashboardGridControls/dashboardGridControls";
import DashboardViewport from "../../components/dashboardViewport/dashboardViewport";
import DashboardCanvas from "../../components/dashboardCanvas/dashboardCanvas";
import DashboardDisplayLayer from "../../components/dashboardDisplayLayer/dashboardDisplayLayer";
import DeleteModal from "../../components/deleteModal/deleteModal";
import DashboardContextMenu from "../../components/dashboardContextMenu/dashboardContextMenu";
import { useDashboardContextMenu } from "../../hooks/useDashboardContextMenu";
import { useDashboardPan } from "../../hooks/useDashboardPan";
import { useDashboardZoom } from "../../hooks/useDashboardZoom";
import { buildGridCssVars } from "../../components/dashboardGridControls/gridUtils";

function Dashboard({
  displays = [],
  setDisplays,
  radios = [],
}: Readonly<DigitalDisplayProps>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);

  const [gridSettings, setGridSettings] =
    useState(DEFAULT_GRID_SETTINGS);

  const [displayPendingDelete, setDisplayPendingDelete] =
    useState<DigitalDisplay | null>(null);

  const fieldValueMap = useMemo(
    () => buildFieldValueMap(radios),
    [radios],
  );

  const { ctxMenu, setCtxMenu } = useDashboardContextMenu();

  const handleDisplayContextMenu = useCallback(
    (e: React.MouseEvent, display: DigitalDisplay) => {
      e.preventDefault();
      e.stopPropagation();
      setCtxMenu({
        x: e.clientX,
        y: e.clientY,
        type: "card",
        displayId: display.digitalDisplayId,
      });
    },
    [setCtxMenu],
  );

  // Clamp pan values to prevent infinite panning
  const clampPan = useCallback(
    (nextPan: { x: number; y: number }, zoomValue: number = zoomRef.current) => {
      if (!viewportRef.current) return nextPan;

      const scaledWidth = GRID_WIDTH * zoomValue;
      const scaledHeight = GRID_HEIGHT * zoomValue;
      const minX = Math.min(0, viewportRef.current.offsetWidth - scaledWidth);
      const minY = Math.min(0, viewportRef.current.offsetHeight - scaledHeight);

      return {
        x: Math.max(minX, Math.min(nextPan.x, 0)),
        y: Math.max(minY, Math.min(nextPan.y, 0)),
      };
    },
    [],
  );

  // Pan hook with clamping
  const { pan, setPan, panning, startPan, onPanMove, stopPan } =
    useDashboardPan(clampPan);

  // Zoom hook with clamping
  const { zoom, handleWheel, mouseRef: zoomMouseRef } = useDashboardZoom(
    setPan,
    clampPan,
  );

  // Sync zoom to ref for drag calculations
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // Get world coordinates from client coordinates
  const getWorldPointFromClient = useCallback(
    (clientX: number, clientY: number) => {
      if (!viewportRef.current) return { x: 0, y: 0 };
      const rect = viewportRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom],
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="main-container" onClick={() => setCtxMenu(null)}>
      <DashboardGridControls
        gridSettings={gridSettings}
        setGridSettings={setGridSettings}
      />

      <DashboardViewport
        ref={viewportRef}
        gridSettings={gridSettings}
        zoom={zoom}
        pan={pan}
        panning={!!panning}
        
        onContextMenu={(e) => {
          e.preventDefault();

          if (e.ctrlKey || panning) return;
          if ((e.target as HTMLElement).closest('[data-card="true"]')) return;

          const point = getWorldPointFromClient(e.clientX, e.clientY);

          setCtxMenu({
            x: e.clientX,
            y: e.clientY,
            type: "page",
            canvasX: point.x,
            canvasY: point.y,
          });
        }}
        onMouseDown={startPan}
        onMouseMove={(e) => {
          const rect = viewportRef.current?.getBoundingClientRect();
          if (rect) {
            mousePos.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
            zoomMouseRef.current = mousePos.current;
          }
          onPanMove(e);
        }}
        onMouseUp={stopPan}
        onMouseLeave={stopPan}
        onWheel={handleWheel}
      >
        <DashboardCanvas gridSettings={gridSettings} gridStyle={buildGridCssVars(gridSettings, zoom, pan)}>
          <DashboardDisplayLayer
            displays={displays}
            setDisplays={setDisplays}
            fieldValueMap={fieldValueMap}
            gridPx={gridSettings.size}
            zoom={zoom}
            pan={pan}
            onDisplayContextMenu={handleDisplayContextMenu}
          />
        </DashboardCanvas>
      </DashboardViewport>

      <DashboardContextMenu
        ctxMenu={ctxMenu}
        closeMenu={() => setCtxMenu(null)}
        onAddDisplay={(x, y) => {
          setDisplays((prev) => [
            ...prev,
            createDisplayFromField({ x, y }, prev.length),
          ]);
        }}
        onDeleteRequest={(id) => {
          const display = displays.find(
            (d) => d.digitalDisplayId === id,
          );

          if (!display) return;
          setDisplayPendingDelete(display);
        }}
      />

      {displayPendingDelete && (
        <DeleteModal
          title="Delete Display"
          message="Are you sure you want to delete this display?"
          onCancel={() => setDisplayPendingDelete(null)}
          onConfirm={() => {
            const idToDelete = displayPendingDelete.digitalDisplayId;

            setDisplays((prev) =>
              prev.filter((display) => display.digitalDisplayId !== idToDelete),
            );

            setDisplayPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;