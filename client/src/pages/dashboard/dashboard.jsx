import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRadioUid } from "../radioConfig/radioUtils/radioIO";
import "./dashboard.css";
import DigitalDisplayCard from "../../components/digitalDisplayCard/digitalDisplayCard";
import {
  CARD_W,
  CARD_H,
  createDragState,
  getDraggedCardPosition,
  moveDraggedDisplay,
  resolveDroppedDisplay,
} from "./dashboardUtils";

const createDisplayFromField = (fieldInfo, count = 0) => ({
  id: crypto.randomUUID(),
  title: fieldInfo.name || `Display ${count + 1}`,
  variable: fieldInfo.name || "",
  suffix: "",
  radioId: fieldInfo.radioId,
  radioUid: fieldInfo.radioUid,
  type: fieldInfo.type || "",
  x: 24 + (count % 4) * 250,
  y: 24 + Math.floor(count / 4) * 170,
});

function Dashboard({ displays = [], setDisplays = () => {}, radios = [] }) {
  const [ctxMenu, setCtxMenu] = useState(null);
  const [variablePickerOpen, setVariablePickerOpen] = useState(false);
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const clampZoom = (value) => Math.min(2, Math.max(0.4, value));
  const canvasScale = 1 / zoom;
  const updateZoom = (delta) => {
    setZoom((prev) => clampZoom(Number((prev + delta).toFixed(2))));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey) return;

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        updateZoom(0.1);
      }

      if (e.key === "-") {
        e.preventDefault();
        updateZoom(-0.1);
      }

      if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const availableVariables = useMemo(() => {
    return radios.flatMap((radio) => {
      const radioUid = getRadioUid(radio) ?? radio.id;
      return (radio.structFields ?? [])
        .filter((field) => field?.name?.trim())
        .map((field) => ({
          radioId: radio.id,
          radioUid,
          name: field.name,
          type: field.type,
          address: field.address,
          bits: field.bits,
          comment: field.comment,
        }));
    });
  }, [radios]);

  const fieldValueMap = useMemo(() => {
  const map = new Map();

  radios.forEach((radio) => {
      (radio.structFields ?? []).forEach((field) => {
        const key = `${radio.id}::${field.name}`;
        map.set(key, field.value ?? "--");
      });
    });

    return map;
  }, [radios]);

  const getDisplayValue = (display) => {
    const key = `${display.radioId}::${display.variable}`;
    const value = fieldValueMap.get(key);
    return value !== undefined && value !== "" ? value : "--";
  };

  const handlePageContextMenu = (e) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, type: "page" });
  };

  const handleCardContextMenu = (e, displayId) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY, type: "card", displayId });
  };

  const openAddDisplayPicker = () => {
    setCtxMenu(null);
    setVariablePickerOpen(true);
  };

  const addDigitalDisplay = (fieldInfo) => {
    setDisplays((prev = []) => [...prev, createDisplayFromField(fieldInfo, prev.length)]);
    setVariablePickerOpen(false);
  };

  const openParameters = (displayId) => {
    setCtxMenu(null);
    navigate(`/dashboard/display/${displayId}`);
  };

  const startDrag = (e, display) => {
  const dragState = createDragState({ e, display, zoom, pan });
  if (!dragState) return;

  setDragging(dragState);
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

  return (
    <div className="main-container" onContextMenu={handlePageContextMenu}>
    <div
      className="dashboard-zoom-viewport"
      onWheel={(e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const nextZoom = clampZoom(
          Number((zoom + (e.deltaY < 0 ? 0.1 : -0.1)).toFixed(2))
        );

        const worldX = (mouseX - pan.x) / zoom;
        const worldY = (mouseY - pan.y) / zoom;

        setPan({
          x: mouseX - worldX * nextZoom,
          y: mouseY - worldY * nextZoom,
        });

        setZoom(nextZoom);
      }}
    >
      <div
        className="dashboard-zoom-layer"
        style={{
          transform: `matrix(${zoom}, 0, 0, ${zoom}, ${pan.x}, ${pan.y})`,
        }}
      >
        <div className={`dashboard-canvas ${displays.length === 0 ? "dashboard-canvas--empty" : ""}`} 
        style={{
          width: `${100 * canvasScale}%`,
          height: `${100 * canvasScale}%`,
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
                }`}
                style={{
                  left: display.x ?? 0,
                  top: display.y ?? 0,
                  width: CARD_W,
                  minHeight: CARD_H,
                }}
                onMouseDown={(e) => startDrag(e, display)}
                onContextMenu={(e) => handleCardContextMenu(e, display.id)}
              >
              <DigitalDisplayCard
                key={display.id}
                display={display}
                value={getDisplayValue(display)}
                onContextMenu={(e) => handleCardContextMenu(e, display.id)}
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
          {ctxMenu.type === "page" && <li onClick={openAddDisplayPicker}>＋ Add digital display</li>}
          {ctxMenu.type === "card" && <li onClick={() => openParameters(ctxMenu.displayId)}>⚙ Parameters</li>}
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
                    onClick={() => addDigitalDisplay(field)}
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