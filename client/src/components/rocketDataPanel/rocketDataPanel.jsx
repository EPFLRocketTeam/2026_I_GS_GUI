import { useRef, useState } from "react";
import "./rocketDataPanel.css";

function RocketDataPanel({
  radio,
  onClose,
  onFieldChange,
  onFieldLabelChange,
  onFieldTypeChange,
  profileOptions = [],
  onSwitchConfig,
}) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ x: window.innerWidth - 460, y: 80 });
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e) => {
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);

    const onMouseMove = (e) =>
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });

    const onMouseUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!radio) return null;

  return (
    <div
      className={`rdp-panel ${dragging ? "rdp-dragging" : ""}`}
      ref={panelRef}
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="rdp-header" onMouseDown={onMouseDown}>
        <span>📡 Radio {radio.uid ?? ""} — Rocket Data</span>
        <button
          className="rdp-close"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="rdp-body">
        <div className="rdp-section">
          <div className="rdp-section-title">Configuration Profile</div>

          <select
            className="rdp-select"
            value={radio.configTemplate ?? "uplink"}
            onChange={(e) => onSwitchConfig?.(e.target.value)}
          >
            {profileOptions.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rdp-section">
          <div className="rdp-section-title">Config Parameters</div>

          {(radio.configParams ?? []).length === 0 ? (
            <p className="rdp-empty">No config parameters found.</p>
          ) : (
            <table className="rdp-table">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {radio.configParams.map((param, pIdx) => (
                  <tr key={`${param.key}-${pIdx}`}>
                    <td>{param.label ?? param.key}</td>
                    <td>
                      <span className="rdp-type-pill">{param.type}</span>
                    </td>
                    <td>{String(param.value ?? "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> 
      </div>
    </div>
  );
}

export default RocketDataPanel;