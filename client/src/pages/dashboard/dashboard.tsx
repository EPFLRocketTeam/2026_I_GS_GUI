import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import "./dashboard.css";
import DigitalDisplayCard from "../../components/digitalDisplayCard/digitalDisplayCard";
import {
  DigitalDisplay,
  DigitalDisplayProps,
} from "../../interfaces/dashboardInterfaces/dashboardInterfaces";
import {
  CARD_W,
  CARD_H,
  GRID_WIDTH,
  GRID_HEIGHT,
  buildFieldValueMap,
  clampDisplayPosition,
  getDisplayValue,
  getOverlappingCardIds,
  getViewportMousePos,
  getCardHeight,
  getCardWidth,
} from "./dashboardUtils";
import { GRID_SIZES, DEFAULT_GRID_SETTINGS } from "../../constants/gridConstants/gridConstants";
import { useNavigate } from "react-router-dom";
import DeleteRadioModal from "../../components/deleteModal/deleteModal";
import { useDashboardPan } from "./hooks/useDashboardPan";
import { useDashboardZoom } from "./hooks/useDashboardZoom";
import { useDashboardDrag } from "./hooks/useDashboardDrag";
import { useDashboardContextMenu } from "./hooks/useDashboardContextMenu";
import {
  buildGridCssVars,
} from "../../components/dashboardGridControls/gridUtils";
import DashboardGridControls from "../../components/dashboardGridControls/dashboardGridControls";

function Dashboard({
  displays = [],
  setDisplays,
  radios = [],
}: Readonly<DigitalDisplayProps>) {
  const navigate = useNavigate();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [gridSettings, setGridSettings] = useState(DEFAULT_GRID_SETTINGS);
  const gridPx = GRID_SIZES[gridSettings.size].px;
  const cardWidth = getCardWidth(gridPx);
  const cardHeight = getCardHeight(gridPx);
  const [displayPendingDelete, setDisplayPendingDelete] =
    useState<DigitalDisplay | null>(null);

  // ---------------------------
  // PAN
  // ---------------------------
  const zoomRef = useRef(1);

  const clampPan = useCallback(
    (
      nextPan: { x: number; y: number },
      zoomValue = zoomRef.current,
    ) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return nextPan;

      const scaledWidth = GRID_WIDTH * zoomValue;
      const scaledHeight = GRID_HEIGHT * zoomValue;
      const minX = Math.min(0, rect.width - scaledWidth);
      const minY = Math.min(0, rect.height - scaledHeight);

      return {
        x: Math.max(minX, Math.min(nextPan.x, 0)),
        y: Math.max(minY, Math.min(nextPan.y, 0)),
      };
    },
    [],
  );

  const { pan, startPan, onPanMove, stopPan, panning, panRef, setPan } =
    useDashboardPan(clampPan);

  // ---------------------------
  // ZOOM
  // ---------------------------
  const {
    zoom,
    panRef: zoomPanRef,
    handleWheel,
  } = useDashboardZoom(setPan, clampPan);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  // sync refs between systems
  panRef.current = pan;
  zoomPanRef.current = pan;

  // ---------------------------
  // DRAG
  // ---------------------------
  const { dragging, startDrag, onDragMove, stopDrag } = useDashboardDrag(
    setDisplays,
    zoom,
    pan,
  );

  // ---------------------------
  // CONTEXT MENU
  // ---------------------------
  const { ctxMenu, setCtxMenu } = useDashboardContextMenu();

  // ---------------------------
  // DERIVED DATA
  // ---------------------------
  const overlappingCardIds = useMemo(
    () => getOverlappingCardIds(displays),
    [displays],
  );

  const fieldValueMap = useMemo(() => buildFieldValueMap(radios), [radios]);

  // ---------------------------
  // WORLD COORDINATES
  // ---------------------------

  const getWorldPointFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const rect = viewportRef.current?.getBoundingClientRect();

      if (!rect) {
        return { x: 0, y: 0 };
      }

      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom],
  );

  // ---------------------------
  // ADD DISPLAY
  // ---------------------------

  const createEmptyDisplay = (point: { x: number; y: number }) => {
    const { x: clampedX, y: clampedY } = clampDisplayPosition({
      x: point.x,
      y: point.y,
    });

    setDisplays((prev) => {
      const newDisplay: DigitalDisplay = {
        digitalDisplayId: crypto.randomUUID(),
        title: 'New display',
        varName: "",
        varValue: "",
        radioId: null,
        type: "",
        posx: clampedX,
        posy: clampedY,
      };

      return [...prev, newDisplay];
    });
  };

  // ---------------------------
  // RENDER
  // ---------------------------

  return (
    <div className="main-container" onClick={() => setCtxMenu(null)}>
      <DashboardGridControls
        gridSettings={gridSettings}
        setGridSettings={setGridSettings}
      />
      <div
        ref={viewportRef}
        className={`dashboard-zoom-viewport dashboard-grid-viewport ${
          panning ? "is-panning" : ""
        }`}
        style={buildGridCssVars(gridSettings, zoom, pan)}
        onContextMenu={(e) => {
          e.preventDefault();

          if (e.ctrlKey || panning) return;
          if ((e.target as HTMLElement).dataset.card === "true") return;

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
          const { x, y } = getViewportMousePos(e);
          mousePos.current = { x, y };
          onPanMove(e);
          onDragMove(e);
        }}
        onMouseUp={() => {
          stopPan();
          stopDrag();
        }}
        onMouseLeave={() => {
          stopPan();
          stopDrag();
        }}
        onWheel={(e) => {
          if (!e.ctrlKey) return;
          e.stopPropagation();
          handleWheel(e);
        }}
      >
        <div
          className="dashboard-zoom-layer"
          style={{
            transform: `matrix(${zoom}, 0, 0, ${zoom}, ${pan.x}, ${pan.y})`,
          }}
        >
          <div
            className={`dashboard-canvas ${
              displays.length === 0 ? "dashboard-canvas--empty" : ""
            }`}
            style={{
              width: `${GRID_WIDTH}px`,
              height: `${GRID_HEIGHT}px`,
            }}
          >
            {displays.length === 0 ? (
              <div className="dashboard-empty">
                Right-click anywhere to add a digital display
              </div>
            ) : (
              displays.map((display) => (
                <div
                  key={display.digitalDisplayId}
                  data-card="true"
                  className={`dashboard-draggable-card ${
                    dragging?.digitalDisplayId === display.digitalDisplayId
                      ? "is-dragging"
                      : ""
                  } ${overlappingCardIds.has(display.digitalDisplayId) ? "is-overlapping" : ""}`}
                  style={{
                    left: display.posx ?? 0,
                    top: display.posy ?? 0,
                    width: cardWidth,
                    minHeight: cardHeight,
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0) startDrag(e, display);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCtxMenu({
                      x: e.clientX,
                      y: e.clientY,
                      type: "card",
                      displayId: display.digitalDisplayId,
                    });
                  }}
                >
                  <DigitalDisplayCard
                    display={display}
                    value={getDisplayValue(fieldValueMap, display)}
                    onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCtxMenu({
                        x: e.clientX,
                        y: e.clientY,
                        type: "card",
                        displayId: display.digitalDisplayId,
                      });
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {ctxMenu && (
        <ul
          className="dashboard-ctx-menu"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {ctxMenu.type === "page" && (
            <li
              onClick={() => {
                createEmptyDisplay({
                  x: ctxMenu.canvasX,
                  y: ctxMenu.canvasY,
                });
                setCtxMenu(null);
              }}
            >
              ＋ Add digital display
            </li>
          )}
          {ctxMenu.type === "card" && (
            <>
              <li
                onClick={() => {
                  setCtxMenu(null);
                  navigate(`/dashboard/display/${ctxMenu.displayId}`);
                }}
              >
                ⚙ Parameters
              </li>

              <li
                onClick={() => {
                  const display = displays.find(
                    (d) => d.digitalDisplayId === ctxMenu.displayId,
                  );
                  if (!display) return;
                  setDisplayPendingDelete(display);
                  setCtxMenu(null);
                }}
              >
                🗑 Remove display
              </li>
            </>
          )}
        </ul>
      )}

      {displayPendingDelete && (
        <DeleteRadioModal
          itemName={`digital display "${displayPendingDelete.title}"`}
          title="Delete digital display?"
          message="This will only remove the display from the dashboard. It will not remove the variable from the data structure table."
          confirmText="Delete display"
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
