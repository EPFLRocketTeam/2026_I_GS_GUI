import { useEffect, useMemo, useReducer } from "react";
import { useLocation } from "react-router-dom";
import "./dataStructConfig.css";
import {
  buildCopyJSON,
  buildCopyStruct,
  parseImportRaw,
  createInitialState,
  dataStructReducer,
} from "./dataStructUtils.js";
import DataStructTable from "../../components/dataStructTable/dataStructTable.jsx";

function DataStructConfig({ radios = [], setRadios }) {
  const location = useLocation();
  const incomingRadioId = location.state?.radioId ?? null;
  const incomingRadioUid = location.state?.radioUid ?? null;
  const incomingFields = location.state?.fields ?? [];

  const availableRadios = useMemo(() => {
  if (radios.length > 0) return radios;

  if (incomingRadioId != null) {
    return [
      {
        id: incomingRadioId,
        uid: incomingRadioUid,
        structFields: incomingFields,
      },
    ];
  }

  return [];
  }, [radios, incomingRadioId, incomingRadioUid, incomingFields]);

  const [state, dispatch] = useReducer(
    dataStructReducer,
    { incomingRadioId, incomingFields, availableRadios },
    createInitialState
  );

  useEffect(() => {
    if (!availableRadios.length) return;
    dispatch({
      type: "HYDRATE_RADIOS",
      radios: availableRadios,
      selectedId: incomingRadioId,
    });
  }, [availableRadios, incomingRadioId]);

  useEffect(() => {
    if (incomingRadioId == null) return;

    dispatch({
      type: "APPLY_ROUTE_SELECTION",
      radioId: incomingRadioId,
      fields: incomingFields,
    });
  }, [incomingRadioId, incomingFields]);

  useEffect(() => {
    if (!state.ui.flashMsg) return;

    const timer = setTimeout(() => {
      dispatch({ type: "SET_FLASH", value: "" });
    }, 1800);

    return () => clearTimeout(timer);
  }, [state.ui.flashMsg]);

  const selectedId = state.selectedId;
  const fields = state.fieldsByRadio[selectedId] ?? [];

  useEffect(() => {
    if (!setRadios || selectedId == null) return;

    setRadios(prev =>
        prev.map(r =>
        r.id === selectedId
            ? { ...r, structFields: fields }
            : r
        )
    );
  }, [selectedId, fields, setRadios]);

  const selectedRadio = availableRadios.find((r) => r.id === selectedId);
  const totalBits = fields.reduce((sum, f) => sum + (Number.parseInt(f.bits) || 0), 0);

  const copyJSON = () => {
      navigator.clipboard.writeText(JSON.stringify(buildCopyJSON(selectedId, fields), null, 2));
      dispatch({ type: "SET_FLASH", value: "JSON copied" });
    };

  const copyStruct = () => {
      navigator.clipboard.writeText(buildCopyStruct(selectedId, fields));
      dispatch({ type: "SET_FLASH", value: "Struct copied" });
    };

  const importJSON = () => {
      dispatch({ type: "SET_IMPORT_ERROR", value: "" });
    try {
      const parsed = parseImportRaw(state.ui.jsonInput);
      dispatch({ type: "IMPORT_FIELDS", fields: parsed });
    } catch (e) {
      dispatch({ type: "SET_IMPORT_ERROR", value: e.message });
    }
  };

  if (availableRadios.length === 0) {
    return (
      <div className="dsc-page">
        <div className="dsc-card">
          <div className="dsc-empty" style={{ padding: "2rem" }}>
            No radios configured yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dsc-page">
      <div className="dsc-card">

        <div className="dsc-header">
          <div className="dsc-header-left">
            <div className="dsc-radio-selector">
              {availableRadios.map(r => (
                <button
                  key={r.id}
                  className={`dsc-radio-tab ${r.id === selectedId ? "active" : ""}`}
                  onClick={() => dispatch({ type: "SET_SELECTED", id: r.id })}
                >
                  <span className="dsc-radio-dot" />
                  Radio {r.uid ?? r.id}
                </button>
              ))}
            </div>
            <span className="dsc-subtitle">
                Data structure · Radio {selectedRadio?.uid ?? incomingRadioUid ?? selectedId}
                            {" "}· {fields.length} field{fields.length !== 1 ? "s" : ""}
                            {" "}· {totalBits} bits
            </span>
          </div>
          <div className="dsc-header-actions">
            {state.ui.flashMsg && <span className="dsc-flash">{state.ui.flashMsg}</span>}
            <button className="dsc-btn" onClick={copyJSON}>Copy JSON</button>
            <button className="dsc-btn" onClick={copyStruct}>Copy C struct</button>
          </div>
        </div>

        <DataStructTable
          fields={fields}
          onUpdateField={(key, prop, value) =>
            dispatch({ type: "UPDATE_FIELD", key, prop, value })
          }
          onRemoveField={(key) =>
            dispatch({ type: "REMOVE_FIELD", key })
          }
        />

        <div className="dsc-add-row" onClick={() => dispatch({ type: "ADD_FIELD" })}>
          <span className="dsc-add-icon">+</span>
          <span>Add field</span>
        </div>

        <div className="dsc-footer">
          <div className="dsc-stat"><div className="dsc-stat-label">Fields</div><div className="dsc-stat-val">{fields.length}</div></div>
          <div className="dsc-stat"><div className="dsc-stat-label">Total bits</div><div className="dsc-stat-val">{totalBits}</div></div>
          <div className="dsc-stat"><div className="dsc-stat-label">Total bytes</div><div className="dsc-stat-val">{Math.ceil(totalBits / 8)}</div></div>
        </div>

        <div className="dsc-import-section">
          <div className="dsc-import-header" onClick={() => dispatch({ type: "TOGGLE_IMPORT" })}>
            <span>Import from JSON</span>
            <span className="dsc-chevron">{state.ui.importOpen ? "▴" : "▾"}</span>
          </div>
          {state.ui.importOpen && (
            <div className="dsc-import-body">
              <textarea
                className="dsc-textarea"
                value={state.ui.jsonInput}
                onChange={e => dispatch({ type: "SET_JSON_INPUT", value: e.target.value })}
                placeholder='[{"name":"packet_nbr","type":"uint32_t","bits":32,"comment":""}]'
              />
              <div className="dsc-import-actions">
                <button className="dsc-btn dsc-btn-primary" onClick={importJSON}>Import</button>
                {state.ui.importError && <span className="dsc-error">{state.ui.importError}</span>}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DataStructConfig;