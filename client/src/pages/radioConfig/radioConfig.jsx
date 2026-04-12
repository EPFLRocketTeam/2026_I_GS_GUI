import { useState, useEffect, useRef } from "react";
import "./radioConfig.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import RocketDataPanel from "../../components/rocketDataPanel/rocketDataPanel";
import { 
  validate, downloadConfig, loadConfig, handleAdd,
  handleConfigChange, handleStructChange, handleStructParse, handleRemove,
  handleFieldChange, handleConfigTypeChange, handleConfigKeyChange,
  handleAddConfigParam, handleRemoveConfigParam, handleFieldLabelChange, handleFieldTypeChange,
  handleUidChange
} from "./radioUtils";

function RadioBoard() {
  const [radios, setRadios] = useState([]);
  const { lastUpdated, isConnected } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");
  const nextId = useRef(1);

  const [ctxMenu, setCtxMenu] = useState(null); 
  const [panelRadioUid, setPanelRadioUid] = useState(null);
  const panelRadio = radios.find(r => r.uid === panelRadioUid) ?? null;

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

  const handleContextMenu = (e, radioUid) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, radioUid });
  };

  const uidCounts = radios.reduce((acc, r) => {
  acc[r.uid] = (acc[r.uid] ?? 0) + 1;
  return acc;
}, {});

  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio Config</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="btn" onClick={() => loadConfig(loaded => { nextId.current = Math.max(...loaded.map(r => r.uid)) + 1; 
              setRadios(validate(loaded)); })}>Load radio config</button>
            <button className="btn" onClick={() => downloadConfig(radios)}>Download config</button>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isConnected ? "#4be34b" : "#ff6b6b" }} />
          <span style={{ fontSize: "12px", color: "#888" }}>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {lastUpdated && <span style={{ fontSize: "12px", color: "#888" }}>Last updated: {lastUpdated}</span>}
      </div>
      <div className={`cards-wrap ${radios.length === 0 ? "cards-wrap--empty" : ""}`}>
        {radios.map((r, i) => (
          <div key={r.uid} onContextMenu={e => handleContextMenu(e, r.uid)}>
            <RadioCard
              radio={r}
              index={i}
              onConfigChange={(index, paramIdx, value) => handleConfigChange(index, paramIdx, value, setRadios)}
              onStructChange={(index, text) => handleStructChange(index, text, setRadios)}
              onStructParse = {(index) => {handleStructParse(index, setRadios); setPanelRadioUid(radios[index].uid)}}
              onFieldChange={(index, fieldIdx, value) => handleFieldChange(index, fieldIdx, value, setRadios)}
              onRemove = {(index) => handleRemove(index, setRadios)}
              onConfigTypeChange={(index, pIdx, value) => handleConfigTypeChange(index, pIdx, value, setRadios)}
              onConfigKeyChange={(index, pIdx, value) => handleConfigKeyChange(index, pIdx, value, setRadios)}
              onAddConfigParam={(index) => handleAddConfigParam(index, setRadios)}
              onRemoveConfigParam={(index, pIdx) => handleRemoveConfigParam(index, pIdx, setRadios)}
              isDuplicateUid={uidCounts[r.uid] > 1}
              onUidChange={(index, value) => handleUidChange(index, value, setRadios)}
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
          <li onClick={() => { setPanelRadioUid(ctxMenu.radioUid); setCtxMenu(null); }}>
            👁 View Rocket Data
          </li>
        </ul>
      )}

      {panelRadio && (
        <RocketDataPanel
          radio={panelRadio}
          onClose={() => setPanelRadioUid(null)}
          onFieldChange={(fieldIdx, value) =>
            handleFieldChange(
              radios.findIndex(r => r.uid === panelRadioUid),
              fieldIdx,
              value,
              setRadios
            )
          }
          onFieldLabelChange={(fieldIdx, value) => 
            handleFieldLabelChange(radios.findIndex(r => r.uid === panelRadioUid), fieldIdx, value, setRadios)}
          onFieldTypeChange={(fieldIdx, value) => 
            handleFieldTypeChange(radios.findIndex(r => r.uid === panelRadioUid), fieldIdx, value, setRadios)}
        />
      )}
      
    </div>
  );
}


export default RadioBoard;