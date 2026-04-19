import { useState } from "react";
import "./dataStructConfig.css";
import {
  TYPES,
  TYPE_BITS,
  dotClass,
  createField,
  buildCopyJSON,
  buildCopyStruct,
  parseImportRaw,
} from "./dataStructUtils.js";

function DataStructConfig({ radioId = 0, initialFields = [] }) {
  const [fields, setFields] = useState(
    initialFields.length > 0 ? initialFields : []
  );
  const [jsonInput, setJsonInput] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const [flashMsg, setFlashMsg] = useState("");

  const flash = (msg) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(""), 1800);
  };

  const addField = () => setFields(prev => [...prev, createField()]);
  const removeField = (key) => setFields(prev => prev.filter(f => f.key !== key));
  const updateField = (key, prop, value) => {
    setFields(prev => prev.map(f => {
      if (f.key !== key) return f;
      const updated = { ...f, [prop]: value };
      if (prop === "type") updated.bits = TYPE_BITS[value] ?? f.bits;
      return updated;
    }));
  };

  const totalBits = fields.reduce((s, f) => s + (Number.parseInt(f.bits) || 0), 0);

    const copyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(buildCopyJSON(radioId, fields), null, 2));
        flash("JSON copied");
    };

    const copyStruct = () => {
        navigator.clipboard.writeText(buildCopyStruct(radioId, fields));
        flash("Struct copied");
    };

    const importJSON = () => {
        setImportError("");
        try {
            setFields(parseImportRaw(jsonInput));
            setJsonInput("");
            setImportOpen(false);
            flash("Imported!");
        } catch (e) {
            setImportError(e.message);
        }
    };

  return (
    <div className="dsc-page">
      <div className="dsc-card">

        <div className="dsc-header">
          <div className="dsc-header-left">
            <div className="dsc-radio-badge">
              <span className="dsc-radio-dot" />
              <span className="dsc-radio-label">Radio {radioId}</span>
            </div>
            <span className="dsc-subtitle">
              Data structure &middot; {fields.length} field{fields.length !== 1 ? "s" : ""} &middot; {totalBits} bits
            </span>
          </div>
          <div className="dsc-header-actions">
            {flashMsg && <span className="dsc-flash">{flashMsg}</span>}
            <button className="dsc-btn" onClick={copyJSON}>Copy JSON</button>
            <button className="dsc-btn" onClick={copyStruct}>Copy C struct</button>
          </div>
        </div>

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
                    onChange={e => updateField(f.key, "name", e.target.value)}
                  />
                </td>
                <td>
                  <div className="dsc-type-wrap">
                    <span className={`dsc-dot ${dotClass(f.type)}`} />
                    <select
                      className="dsc-input dsc-select"
                      value={f.type}
                      onChange={e => updateField(f.key, "type", e.target.value)}
                    >
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
                    onChange={e => updateField(f.key, "bits", e.target.value)}
                  />
                </td>
                <td>
                    <input
                        className="dsc-input dsc-value"
                        value={f.value}
                        placeholder="—"
                        onChange={e => updateField(f.key, "value", e.target.value)}
                    />
                    </td>
                <td>
                  <input
                    className="dsc-input dsc-comment"
                    value={f.comment}
                    placeholder="optional note"
                    onChange={e => updateField(f.key, "comment", e.target.value)}
                  />
                </td>
                <td>
                  <button className="dsc-del" onClick={() => removeField(f.key)}>✕</button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={6} className="dsc-empty">No fields yet — add one below</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="dsc-add-row" onClick={addField}>
          <span className="dsc-add-icon">+</span>
          <span>Add field</span>
        </div>

        <div className="dsc-footer">
          <div className="dsc-stat"><div className="dsc-stat-label">Fields</div><div className="dsc-stat-val">{fields.length}</div></div>
          <div className="dsc-stat"><div className="dsc-stat-label">Total bits</div><div className="dsc-stat-val">{totalBits}</div></div>
          <div className="dsc-stat"><div className="dsc-stat-label">Total bytes</div><div className="dsc-stat-val">{Math.ceil(totalBits / 8)}</div></div>
        </div>

        <div className="dsc-import-section">
          <div className="dsc-import-header" onClick={() => setImportOpen(o => !o)}>
            <span>Import from JSON</span>
            <span className="dsc-chevron">{importOpen ? "▴" : "▾"}</span>
          </div>
          {importOpen && (
            <div className="dsc-import-body">
              <textarea
                className="dsc-textarea"
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                placeholder='[{"name":"packet_nbr","type":"uint32_t","bits":32,"comment":""}]'
              />
              <div className="dsc-import-actions">
                <button className="dsc-btn dsc-btn-primary" onClick={importJSON}>Import</button>
                {importError && <span className="dsc-error">{importError}</span>}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DataStructConfig;