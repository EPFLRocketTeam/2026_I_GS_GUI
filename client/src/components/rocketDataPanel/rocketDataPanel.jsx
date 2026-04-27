import { useRef, useState } from "react";
import "./rocketDataPanel.css";

function RocketDataPanel({ radio, onClose, onFieldChange, onFieldLabelChange, onFieldTypeChange }) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ x: window.innerWidth - 380, y: 80 });
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e) => {
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
    const onMouseMove = (e) => setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    const onMouseUp = () => { setDragging(false); window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
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
        <span>📡 Radio {radio.uid} — Rocket Data</span>
        <button className="rdp-close" onMouseDown={e => e.stopPropagation()} onClick={onClose}>✕</button>
      </div>

      <div className="rdp-body">
        {(radio.structFields ?? []).length === 0 ? (
          <p className="rdp-empty">No struct parsed yet. Paste and parse a struct first.</p>
        ) : (
          <table className="rdp-table">
            <colgroup>
                <col />
                <col />
                <col />
            </colgroup>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {radio.structFields.map((field, fIdx) => (
                <tr key={field.key + fIdx}>
                  <td>
                    <input
                      className="rdp-input"
                      value={field.label}
                      onChange={e => onFieldLabelChange?.(fIdx, e.target.value)}
                      placeholder="field"
                    />
                  </td>
                  <td>
                    <input
                      className="rdp-input rdp-type-input"
                      value={field.type}
                      onChange={e => onFieldTypeChange?.(fIdx, e.target.value)}
                      placeholder="type"
                    />
                  </td>
                  <td>
                    <input
                      className="rdp-input"
                      value={field.value}
                      onChange={e => onFieldChange?.(fIdx, e.target.value)}
                      placeholder="—"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RocketDataPanel;