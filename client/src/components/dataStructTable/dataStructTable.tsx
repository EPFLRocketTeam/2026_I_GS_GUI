import "./dataStructTable.css";
import { TYPES, dotClass } from "../../pages/dataStructConfig/dataStructUtils";
import { DataStructProps, STRUCT_TABLE_FIELDS, EMPTY_FIELD_MESSAGE, MAX_BITS_STRUCT, MIN_BITS_STRUCT, DATA_STRUCT_TABLE_COLS } from "../../constants/dataStructConstants";

function DataStructTable({ fields, onUpdateField, onRemoveField }:
  Readonly<DataStructProps>
) {
  return (
    <table className="dsc-table">
      <thead>
        <tr>
          <th className="col-num">{STRUCT_TABLE_FIELDS.nbr}</th>
          <th className="col-name">{STRUCT_TABLE_FIELDS.fieldName}</th>
          <th className="col-type">{STRUCT_TABLE_FIELDS.type}</th>
          <th className="col-bits">{STRUCT_TABLE_FIELDS.bits}</th>
          <th className="col-comment">{STRUCT_TABLE_FIELDS.comment}</th>
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
                min={MIN_BITS_STRUCT} 
                max={MAX_BITS_STRUCT}
                value={f.bits}
                onChange={(e) => onUpdateField(f.key, "bits", e.target.value)}
              />
            </td>
            <td>
              <input
                className="dsc-input dsc-comment"
                value={f.comment}
                placeholder="optional note"
                onChange={(e) =>
                  onUpdateField(f.key, "comment", e.target.value)
                }
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
            <td colSpan={DATA_STRUCT_TABLE_COLS} className="dsc-empty">
              {EMPTY_FIELD_MESSAGE}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default DataStructTable;
