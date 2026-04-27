import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { getRadioUid } from "../radioConfig/radioUtils/radioIO";
import "./dashboard.css";
import DigitalDisplayCard from "../../components/digitalDisplayCard/digitalDisplayCard";
import {
  CARD_W,
  CARD_H,
  getDraggedCardPosition,
  moveDraggedDisplay,
  resolveDroppedDisplay,
  buildAvailableVariables,
  getNextZoomPan,
  getViewportMousePos,
  buildFieldValueMap,
  getDisplayValue,
  createDisplayFromField,
  createDragState,
  getOverlappingCardIds,
} from "./dashboardUtils";
import { useNavigate } from "react-router-dom";

function Dashboard({ displays = [], setDisplays = () => {}, radios = [] }) {
  const navigate = useNavigate();
  const [ctxMenu, setCtxMenu] = useState(null);
  const [variablePickerOpen, setVariablePickerOpen] = useState(false);
  const [dragging, setDragging] = useState(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(null);

  useEffect(() => { panRef.current = pan; }, [pan]);

  const overlappingCardIds = useMemo(
  () => getOverlappingCardIds(displays),
  [displays]
);

  const availableVariables = useMemo(
    () => buildAvailableVariables(radios, getRadioUid),
    [radios]
  );

  const fieldValueMap = useMemo(
    () => buildFieldValueMap(radios),
    [radios]
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
      x,
      y,
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

  return (
    <div className="main-container" onContextMenu={ (e) => { e.preventDefault(); if (e.ctrlKey || panning) return; setCtxMenu({ x: e.clientX, y: e.clientY, type: "page" }); } }>
    <div
      className={`dashboard-zoom-viewport ${panning ? "is-panning" : ""}`}
      onMouseDown={startPan}
      onMouseMove={(e) => { const { x, y } = getViewportMousePos(e); mousePos.current = { x, y }; handlePanMove(e);}}
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
        <div className={`dashboard-canvas ${displays.length === 0 ? "dashboard-canvas--empty" : ""}`} 
        style={{ width: `${100 / zoom}%`, height: `${100 / zoom}%` }}
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

      {ctxMenu && (
        <ul
          className="dashboard-ctx-menu"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {ctxMenu.type === "page" && <li onClick={() => { setCtxMenu(null); setVariablePickerOpen(true); }}>＋ Add digital display</li>}
          {ctxMenu.type === "card" && <li onClick={() => { setCtxMenu(null); navigate(`/dashboard/display/${ctxMenu.displayId}`); }}>⚙ Parameters</li>}
        </ul>
      )}

      {variablePickerOpen && (
        <div className="dashboard-modal-overlay" onClick={() => setVariablePickerOpen(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-title">Choose a variable</div>
            <div className="dashboard-modal-subtitle">
              Select one variable from the data structures of all configured radios
            </div>

            <div className="dashboard-variable-list">
              {availableVariables.length === 0 ? (
                <div className="dashboard-empty-variables">
                  No variables found. Configure a radio data structure first.
                </div>
              ) : (
                availableVariables.map((field) => (
                  <button
                    key={`${field.radioId}-${field.name}-${field.address ?? ""}`}
                    className="dashboard-variable-item"
                    onClick={() => {
                        setDisplays((prev = []) => [...prev, createDisplayFromField(field, prev.length)]);
                        setVariablePickerOpen(false);
                      }}
                  >
                    <div className="dashboard-variable-main">
                      <div className="dashboard-variable-name">{field.name}</div>
                      <div className="dashboard-variable-meta">
                        Radio {field.radioUid} · {field.type || "—"} · Addr {field.address ?? 0}
                      </div>
                    </div>
                    <div className="dashboard-variable-pick">Add</div>
                  </button>
                ))
              )}
            </div>

            <div className="dashboard-modal-actions">
              <button className="dashboard-modal-btn" onClick={() => setVariablePickerOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default Dashboard;