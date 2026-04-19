import "./dataStructTable.css";
import { TYPES, dotClass } from "../../pages/dataStructConfig/dataStructUtils";

function DataStructTable({ fields, onUpdateField, onRemoveField }) {
  return (
    <table className="dsc-table">
      <thead>
        <tr>
          <th className="col-num">#</th>
          <th className="col-name">Field name</th>
          <th className="col-type">Type</th>
          <th className="col-bits">Bits</th>
          <th className="col-value">Value</th>
          <th className="col-comment">Comment</th>
          <th className="col-del" />
        </tr>
      </thead>
      <tbody>
        {fields.map((f, i) => (
          <tr key={f.key} className="dsc-row">
            <td className="col-num">{i + 1}</td>
            <td>
              <input
                className="dsc-input"
                value={f.name}
                placeholder="field_name"
                onChange={(e) => onUpdateField(f.key, "name", e.target.value)}
              />
            </td>
            <td>
              <div className="dsc-type-wrap">
                <span className={`dsc-dot ${dotClass(f.type)}`} />
                <select
                  className="dsc-input dsc-select"
                  value={f.type}
                  onChange={(e) => onUpdateField(f.key, "type", e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td>
              <input
                className="dsc-input dsc-bits"
                type="number"
                min="1"
                max="64"
                value={f.bits}
                onChange={(e) => onUpdateField(f.key, "bits", e.target.value)}
              />
            </td>
            <td>
              <input
                className="dsc-input dsc-value"
                value={f.value}
                placeholder="—"
                onChange={(e) => onUpdateField(f.key, "value", e.target.value)}
              />
            </td>
            <td>
              <input
                className="dsc-input dsc-comment"
                value={f.comment}
                placeholder="optional note"
                onChange={(e) => onUpdateField(f.key, "comment", e.target.value)}
              />
            </td>
            <td>
              <button className="dsc-del" onClick={() => onRemoveField(f.key)}>
                ✕
              </button>
            </td>
          </tr>
        ))}

        {fields.length === 0 && (
          <tr>
            <td colSpan={7} className="dsc-empty">
              No fields yet — add one below
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default DataStructTable;