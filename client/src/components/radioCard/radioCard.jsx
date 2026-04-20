import "./radioCard.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";

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
  const uid = getRadioUid(radio) ?? "—";

  return (
    
    <div className="radio-card">
        {isDuplicateUid && (
          <div className="warn-inline">same id used twice</div>
        )}
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-title">Radio {uid}</span>
        </div>

        <div className="card-header-actions">
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
          <button
            className="btn btn-danger btn-delete-radio"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(index);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="section-title">Config Parameters</div>
       {(radio.configParams ?? []).map((param, pIdx) => (
        <div className="param-block" key={param.key + pIdx}>
          <div className="name-value-row">
            <div className="param-label">
              {param.label}
            </div>

            {param.control === "select" ? (
              <select
                className="table-input param-value-input"
                value={param.value}
                onChange={(e) => onConfigChange?.(index, pIdx, e.target.value)}
              >
                {(param.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="table-input param-value-input"
                type={param.control === "number" ? "numeric" : "text"}
                min={param.min}
                max={param.max}
                maxLength={param.maxLength}
                value={param.value}
                onChange={(e) => {
                  let nextValue = e.target.value;

                  if (param.control === "number") {
                    nextValue = nextValue.replace(/\D/g, "");
                    if (param.maxLength != null) {
                      nextValue = nextValue.slice(0, param.maxLength);
                    }
                  }

                  onConfigChange?.(index, pIdx, nextValue);
                }}
                placeholder="value"
              />
            )}
          </div>
        </div>
      ))}
        <button className="btn" onClick={() => onConfigDataStruct?.(index)}>Config Data Structure</button>
    </div>
  );
}

export default RadioCard;