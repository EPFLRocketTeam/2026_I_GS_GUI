import "./radioCard.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";
import {RadioCardProps} from "../../types/types"
import { CONFIG_DATA_STRUCT, CONFIG_PARAMS, DELETE_LABEL, RADIO_LABEL, SAME_ID_WARNING, STATUS_BADGE } from "../../constants/radioCardConstants";

function RadioCard({
  radio,
  index,
  onConfigChange,
  onRemove,
  isDuplicateUid,
  onConfigDataStruct,
}: Readonly<RadioCardProps>
) {
  const badge = STATUS_BADGE[radio.status] ?? STATUS_BADGE.offline;
  const uid = getRadioUid(radio) ?? "—";

  return (
    <div className="radio-card">
      {isDuplicateUid && <div className="warn-inline">{SAME_ID_WARNING}</div>}
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-title">{RADIO_LABEL} {uid}</span>
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
            {DELETE_LABEL}
          </button>
        </div>
      </div>
      <div className="section-title">{CONFIG_PARAMS}</div>
      {(radio.configParams ?? []).map((param, pIdx) => (
        <div className="param-block" key={param.key + pIdx}>
          <div className="name-value-row">
            <div className="param-label">{param.label}</div>

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
      <button className="btn" onClick={() => onConfigDataStruct?.(index)}>
        {CONFIG_DATA_STRUCT}
      </button>
    </div>
  );
}

export default RadioCard;
