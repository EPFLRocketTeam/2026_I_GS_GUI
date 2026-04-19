import { useState, useEffect, useRef } from "react";
import "./radioConfig.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import RocketDataPanel from "../../components/rocketDataPanel/rocketDataPanel";
import { 
  validate, downloadConfig, loadConfig, handleAdd,
  handleConfigChange, handleStructChange, handleStructParse, handleRemove,
  handleFieldChange, handleConfigTypeChange, handleConfigKeyChange,
  handleFieldLabelChange, handleFieldTypeChange,
  handleUidChange
} from "./radioUtils";
import { ensureRadioIds } from "./radioUtils/radioDefaults";
import { getRadioUid, uidCounts } from "./radioUtils/radioIO";
import { useNavigate } from "react-router-dom";

function RadioConfig() {
  const [radios, setRadios] = useState([]);
  const { lastUpdated, isConnected } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");
  const nextId = useRef(1);

  const [ctxMenu, setCtxMenu] = useState(null); 
  const [panelRadioId, setPanelRadioId] = useState(null);
  const panelRadio = radios.find(r => r.id === panelRadioId) ?? null;

  useEffect(() => {
    if (!radios.length) {
      nextId.current = 1;
      return;
    }

    const maxUid = Math.max(...radios.map((r) => Number(r.uid) || 0));
    if (maxUid >= nextId.current) {
      nextId.current = maxUid + 1;
    }
  }, [radios]);

  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleContextMenu = (e, radioId) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, radioId: radioId });
  };

  const navigate = useNavigate();

  const handleConfigDataStruct = (index) => {
    navigate(`/dataStructConfig`);
  };

  const counts = uidCounts(radios);

  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio Config</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="btn" onClick={() => loadConfig(loaded => {
              const normalized = ensureRadioIds(loaded);
              nextId.current = Math.max(0, ...normalized.map(r => Number(r.uid) || 0)) + 1;
              setRadios(validate(normalized));
            })}>Load radio config</button>
            <button className="btn" onClick={() => downloadConfig(radios)}>Download config</button>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isConnected ? "#4be34b" : "#ff6b6b" }} />
          <span style={{ fontSize: "12px", color: "#888" }}>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {lastUpdated && <span style={{ fontSize: "12px", color: "#888" }}>Last updated: {lastUpdated}</span>}
      </div>
      <div className={`cards-wrap ${radios.length === 0 ? "cards-wrap--empty" : ""}`}>
        {radios.map((r, i) => (
          <div key={r.id} onContextMenu={e => handleContextMenu(e, r.id)}>
            <RadioCard
              radio={r}
              index={i}
              onConfigChange={(index, paramIdx, value) => handleConfigChange(index, paramIdx, value, setRadios)}
              onStructChange={(index, text) => handleStructChange(index, text, setRadios)}
              onStructParse = {(index) => {handleStructParse(index, setRadios); setPanelRadioId(radios[index].id)}}
              onFieldChange={(index, fieldIdx, value) => handleFieldChange(index, fieldIdx, value, setRadios)}
              onRemove = {(index) => handleRemove(index, setRadios)}
              onConfigTypeChange={(index, pIdx, value) => handleConfigTypeChange(index, pIdx, value, setRadios)}
              onConfigKeyChange={(index, pIdx, value) => handleConfigKeyChange(index, pIdx, value, setRadios)}
              isDuplicateUid={counts[getRadioUid(r)] > 1}
              onUidChange={(index, value) => handleUidChange(index, value, setRadios)}
              onConfigDataStruct={(index) => handleConfigDataStruct(index, setRadios)} 
            />
          </div>
        ))}
        <button className="add-btn" onClick={() => handleAdd(nextId, setRadios)}>+</button>
      </div>
        {ctxMenu && (
        <ul
          className="ctx-menu"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <li onClick={() => { setPanelRadioId(ctxMenu.radioId); setCtxMenu(null); }}>
            👁 View Rocket Data
          </li>
        </ul>
      )}

      {panelRadio && (
        <RocketDataPanel
          radio={panelRadio}
          onClose={() => setPanelRadioId(null)}
          onFieldChange={(fieldIdx, value) =>
            handleFieldChange(
              radios.findIndex(r => r.id === panelRadioId),
              fieldIdx,
              value,
              setRadios
            )
          }
          onFieldLabelChange={(fieldIdx, value) => 
            handleFieldLabelChange(radios.findIndex(r => r.id === panelRadioId), fieldIdx, value, setRadios)}
          onFieldTypeChange={(fieldIdx, value) => 
            handleFieldTypeChange(radios.findIndex(r => r.id === panelRadioId), fieldIdx, value, setRadios)}
        />
      )}
      
    </div>
  );
}


export default RadioConfig;