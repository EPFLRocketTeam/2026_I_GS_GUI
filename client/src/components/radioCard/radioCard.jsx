import "./radioCard.css";

const STATUS_BADGE = {
  online:  { label: "online",  cls: "badge-online" },
  syncing: { label: "syncing", cls: "badge-syncing" },
  offline: { label: "offline", cls: "badge-offline" },
  waiting: { label: "waiting", cls: "badge-syncing" },
};

function RadioCard({ radio, index, readOnly = false, onChange, onPinChange, onAddPin, onRemovePin, onLoad, onRemove }) {
  const badge = STATUS_BADGE[radio.status] ?? STATUS_BADGE.offline;
  const pins = radio.pins ?? [];

  return (
    <div className="radio-card">
      <div className="card-header">
        <span className="card-title">Radio {radio.uid}</span>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
      </div>

      <div className="field">
        <label>ID</label>
        <input value={radio.idVal} onChange={e => onChange?.(index, "idVal", e.target.value)} readOnly={readOnly} />
      </div>

      {pins.map((pin, pinIdx) => (
        <div className="field pin-row" key={pin.key + pinIdx}>
          <div className="pin-labels">
            <input className="pin-label-input" value={pin.label} onChange={e => onPinChange?.(index, pinIdx, "label", e.target.value)} placeholder="Label" readOnly={readOnly} />
            <input className="pin-unit-input"  value={pin.unit}  onChange={e => onPinChange?.(index, pinIdx, "unit",  e.target.value)} placeholder="Unit" readOnly={readOnly} />
            {pin.type && <span className="pin-type">({pin.type})</span>}
          </div>
          <div className="pin-value-row">
            <input value={pin.value} onChange={e => onPinChange?.(index, pinIdx, "value", e.target.value)} placeholder="Value" readOnly={readOnly} />
            {!readOnly && <button className="btn-remove-pin" onClick={() => onRemovePin?.(index, pinIdx)}>−</button>}
          </div>
        </div>
      ))}

      {!readOnly && <button className="btn-add-pin" onClick={() => onAddPin?.(index)}>+ add pin</button>}

      {radio.errors?.map(err => (
        <div className="warn-box" key={err}>▲ {err}</div>
      ))}

      {!readOnly && (
        <div className="card-footer">
          <button className="btn" onClick={() => onLoad?.(index)}>Load</button>
          <button className="btn btn-danger" onClick={() => onRemove?.(index)}>✕</button>
        </div>
      )}

      {radio.hex_data && (
        <div className="field">
          <label>HEX Data</label>
          <textarea value={radio.hex_data} readOnly style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }} />
        </div>
      )}
    </div>
  );
}

export default RadioCard;