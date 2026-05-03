import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import "./dashboard.css";
import DigitalDisplayCard from "../../components/digitalDisplayCard/digitalDisplayCard";
import {
  CARD_W,
  CARD_H,
  getDraggedCardPosition,
  moveDraggedDisplay,
  resolveDroppedDisplay,
  getNextZoomPan,
  getViewportMousePos,
  buildFieldValueMap,
  getDisplayValue,
  createDragState,
  getOverlappingCardIds,
} from "./dashboardUtils";
import { useNavigate } from "react-router-dom";
import DeleteRadioModal from "../../components/deleteRadioModal/deleteRadioModal";
import DashboardGridControls, {
  DEFAULT_GRID_SETTINGS,
  buildGridCssVars,
  snapToGridValue,
} from "../../components/dashboardGridControls/dashboardGridControls";

function Dashboard({ displays = [], setDisplays = () => {}, radios = [] }) {
  const navigate = useNavigate();
  const [ctxMenu, setCtxMenu] = useState(null);
  const [dragging, setDragging] = useState(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(null);
  const [displayPendingDelete, setDisplayPendingDelete] = useState(null);
  const [gridSettings, setGridSettings] = useState(DEFAULT_GRID_SETTINGS);

  useEffect(() => { panRef.current = pan; }, [pan]);

  const overlappingCardIds = useMemo(
  () => getOverlappingCardIds(displays),
  [displays]
);

  const fieldValueMap = useMemo(
    () => buildFieldValueMap(radios),
    [radios]
  );

  const snapValue = useCallback(
    (value) => snapToGridValue(value, gridSettings),
    [gridSettings]
  );

  const startPan = (e) => {
    if (e.button !== 2 ||!e.ctrlKey) return;
    if (e.target.closest(".dashboard-draggable-card")) return;

    e.preventDefault();
    setCtxMenu(null);

    setPanning({
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    });
  };

  const getWorldPointFromClient = useCallback(
    (clientX, clientY) => {
      const rect = viewportRef.current?.getBoundingClientRect();

      if (!rect) {
        return { x: 0, y: 0 };
      }

      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  const handlePanMove = (e) => {
    if (!panning) return;

    setPan({
      x: panning.startPanX + (e.clientX - panning.startMouseX),
      y: panning.startPanY + (e.clientY - panning.startMouseY),
    });
  };

  const stopPan = () => {
    setPanning(null);
  };

  const zoomAround = useCallback((delta) => {
    const currentPan = panRef.current;
    setZoom((prevZoom) => {
      const { zoom: nextZoom, pan: nextPan } = getNextZoomPan({
        mouseX: mousePos.current.x,
        mouseY: mousePos.current.y,
        zoom: prevZoom,
        pan: currentPan,
        delta,
      });
      setPan(nextPan);
      return nextZoom;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey) return;
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAround(0.05); }
      if (e.key === "-") { e.preventDefault(); zoomAround(-0.05); }
      if (e.key === "0") { e.preventDefault(); setZoom(1); setPan({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomAround]);

  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);


  const handleWheel = (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const { x: mouseX, y: mouseY } = getViewportMousePos(e);
    const { zoom: nextZoom, pan: nextPan } = getNextZoomPan({
      mouseX, mouseY, zoom, pan, delta: e.deltaY < 0 ? 0.1 : -0.1,
    });
    setPan(nextPan);
    setZoom(nextZoom);
  };

const handleCanvasMouseMove = (e) => {
  if (!dragging) return;

  const { x, y } = getDraggedCardPosition({ e, dragging, zoom, pan });

  setDisplays((prev) =>
    moveDraggedDisplay({
      displays: prev,
      dragging,
      x: snapValue(x),
      y: snapValue(y),
    })
  );
};

const handleCanvasMouseUp = () => {
  if (!dragging) return;

  setDisplays((prev) =>
    resolveDroppedDisplay({
      displays: prev,
      dragging,
    })
  );

  setDragging(null);
};

const startDrag = (e, display) => {
    const dragState = createDragState({ e, display, zoom, pan });
    if (dragState) setDragging(dragState);
  };

const createEmptyDisplay = (point = null) => {
  setDisplays((prev = []) => {
    const fallbackX = 40 + prev.length * 20;
    const fallbackY = 40 + prev.length * 20;

    const x = point?.x ?? fallbackX;
    const y = point?.y ?? fallbackY;

    return [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: `Display ${prev.length + 1}`,
        name: "",
        radioId: null,
        radioUid: "",
        variable: "",
        type: "",
        address: null,
        x: snapValue(x),
        y: snapValue(y),
      },
    ];
  });
};
  return (
    <div className="main-container" >
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
        if (e.target.closest(".dashboard-draggable-card")) return;

        const point = getWorldPointFromClient(e.clientX, e.clientY);

        setCtxMenu({
          x: e.clientX,
          y: e.clientY,
          type: "page",
          canvasX: snapValue(point.x),
          canvasY: snapValue(point.y),
        });
      }}
      onMouseDown={startPan}
      onMouseMove={(e) => {
        const { x, y } = getViewportMousePos(e);
        mousePos.current = { x, y };
        handlePanMove(e);
      }}
      onMouseUp={stopPan}
      onMouseLeave={stopPan}
      onWheel={handleWheel}
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
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
          }}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}>
          {displays.length === 0 ? (
            <div className="dashboard-empty">Right-click anywhere to add a digital display</div>
          ) : (
            displays.map((display) => (
              <div
                key={display.id}
                className={`dashboard-draggable-card ${
                  dragging?.id === display.id ? "is-dragging" : ""
                } ${overlappingCardIds.has(display.id) ? "is-overlapping" : ""}`}
                style={{
                  left: display.x ?? 0,
                  top: display.y ?? 0,
                  width: CARD_W,
                  minHeight: CARD_H,
                }}
                onMouseDown={(e) => {
                  if (e.button === 0) startDrag(e, display);
                }}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, type: "card", displayId: display.id }); }}
              >
              <DigitalDisplayCard
                display={display}
                value={getDisplayValue(fieldValueMap, display)}
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
              <li onClick={() => {
                setCtxMenu(null);
                navigate(`/dashboard/display/${ctxMenu.displayId}`);
              }}>
                ⚙ Parameters
              </li>

              <li onClick={() => {
                const display = displays.find((d) => d.id === ctxMenu.displayId);
                  setDisplayPendingDelete(display);
                  setCtxMenu(null);
                }}>
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
            setDisplays((prev) =>
              prev.filter((display) => display.id !== displayPendingDelete.id)
            );
            setDisplayPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;