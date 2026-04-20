import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRadioUid } from "../radioConfig/radioUtils/radioIO";
import "./dashboard.css";

const createDisplayFromField = (fieldInfo, count = 0) => ({
  id: crypto.randomUUID(),
  title: fieldInfo.name || `Display ${count + 1}`,
  variable: fieldInfo.name || "",
  suffix: "",
  value: "--",
  radioId: fieldInfo.radioId,
  radioUid: fieldInfo.radioUid,
  type: fieldInfo.type || "",
});

function Dashboard({ displays = [], setDisplays = () => {}, radios = [] }) {
  const [ctxMenu, setCtxMenu] = useState(null);
  const [variablePickerOpen, setVariablePickerOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="main-container" onContextMenu={handlePageContextMenu}>
      <div className="dashboard-topbar">
        <span className="dashboard-hint">Right-click to add a digital display</span>
      </div>

      <div className={`dashboard-grid ${displays.length === 0 ? "dashboard-grid--empty" : ""}`}>
        {displays.length === 0 ? (
          <div className="dashboard-empty">Right-click anywhere to add a digital display</div>
        ) : (
          displays.map((display) => (
            <div
              key={display.id}
              className="digital-display-card"
              onContextMenu={(e) => handleCardContextMenu(e, display.id)}
            >
              <div className="digital-display-title">{display.title || "Untitled display"}</div>
              <div className="digital-display-value">
                {display.value ?? "--"}
                {display.suffix ? <span className="digital-display-suffix">{display.suffix}</span> : null}
              </div>
              <div className="digital-display-variable">
                Radio {display.radioUid ?? "?"} · {display.variable || "No variable selected"}
              </div>
            </div>
          ))
        )}
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
  );
}

export default Dashboard;