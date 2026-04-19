import "./radioCard.css";

const STATUS_BADGE = {
  online:  { label: "online",  cls: "badge-online" },
  syncing: { label: "syncing", cls: "badge-syncing" },
  offline: { label: "offline", cls: "badge-offline" },
  waiting: { label: "waiting", cls: "badge-syncing" },
};

function RadioCard({ radio, index, onConfigChange, onStructChange, onStructParse,
   onRemove, isDuplicateUid, onConfigDataStruct
 }) {
  const badge = STATUS_BADGE[radio.status] ?? STATUS_BADGE.offline;

  return (
    
    <div className="radio-card">
        {isDuplicateUid && (
          <div className="warn-inline">same id used twice</div>
        )}
      <div className="card-header">
        <div className="uid-edit-row">
          <span className="card-title">Radio</span>
        </div>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
        <button className="btn btn-danger" onClick={() => onRemove?.(index)}>✕</button>
      </div>
      <div className="section-title">Config Parameters</div>
        {(radio.configParams ?? []).map((param, pIdx) => (
        <div className="param-block" key={param.key + pIdx}>
            <div className="name-value-row">
              <div className="param-label">
                {param.label}
              </div>
            <input
              className="table-input param-value-input"
              value={param.value}
              onChange={e => onConfigChange?.(index, pIdx, e.target.value)}
              placeholder="value"
            />
            </div>
        </div>
        ))}
        <button className="btn" onClick={() => onConfigDataStruct?.(index)}>Config Data Structure</button>
    </div>
  );
}

export default RadioCard;