import "./radioCard.css";

const STATUS_BADGE = {
  online:  { label: "online",  cls: "badge-online" },
  syncing: { label: "syncing", cls: "badge-syncing" },
  offline: { label: "offline", cls: "badge-offline" },
  waiting: { label: "waiting", cls: "badge-syncing" },
};

function RadioCard({ radio, index, onConfigChange, onStructChange, onStructParse, onFieldChange, onRemove,
  onConfigKeyChange, onConfigLabelChange, onConfigTypeChange, onAddConfigParam, onRemoveConfigParam, onFieldLabelChange, onFieldTypeChange  
 }) {
  const badge = STATUS_BADGE[radio.status] ?? STATUS_BADGE.offline;

  return (
    
    <div className="radio-card">
      <div className="card-header">
        <span className="card-title">Radio {radio.uid}</span>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
        <button className="btn btn-danger" onClick={() => onRemove?.(index)}>✕</button>
      </div>

      <div className="section-title">Config Parameters</div>

        {(radio.configParams ?? []).map((param, pIdx) => (
        <div className="param-block" key={param.key + pIdx}>
          <div className="param-top-row">
            <input
              className="table-input param-label-input"
              value={param.label}
              onChange={e => onConfigLabelChange?.(index, pIdx, e.target.value)}
              placeholder="name"
            />
            <input
              className="table-input param-type-input"
              value={param.type}
              onChange={e => onConfigTypeChange?.(index, pIdx, e.target.value)}
              placeholder="type"
            />
            <button className="btn-remove-param" onClick={() => onRemoveConfigParam?.(index, pIdx)}>−</button>
          </div>
          <input
            className="table-input param-value-input"
            value={param.value}
            onChange={e => onConfigChange?.(index, pIdx, e.target.value)}
            placeholder="value"
          />
        </div>
        ))}
      <button className="btn-add-param" onClick={() => onAddConfigParam?.(index)}>+ add parameter</button>

      <div className="section-title">Data Structure</div>
            <textarea
              className="struct-textarea"
              placeholder={"Paste your C struct body here, e.g.:\nuint32_t packet_nbr;\nuint16_t altitude;"}
              value={radio.structText ?? ""}
              onChange={e => onStructChange?.(index, e.target.value)}
            />
            <button className="btn btn-parse" onClick={() => onStructParse?.(index)}>
              Parse struct
            </button>
      {radio.errors?.map(err => (
              <div className="warn-box" key={err}>▲ {err}</div>
            ))}
    </div>
  );
}

export default RadioCard;