import { useState, useEffect } from "react";
import "./radioConfig.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import RocketDataPanel from "../../components/rocketDataPanel/rocketDataPanel";
import { 
  validate, DEFAULT_RADIOS, downloadConfig, loadConfig, handleAdd,
  handleConfigChange, handleStructChange, handleStructParse, handleRemove,
  handleFieldChange
} from "./radioUtils";

function RadioBoard() {
  const [radios, setRadios] = useState(DEFAULT_RADIOS);
  const { lastUpdated, isConnected, lastReceived } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");
  let nextId = { current: Math.max(...DEFAULT_RADIOS.map(r => r.uid)) + 1 };

  // Context menu state
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, radioUid }
  // Panel state
  const [panelRadioUid, setPanelRadioUid] = useState(null);

  const panelRadio = radios.find(r => r.uid === panelRadioUid) ?? null;

  useEffect(() => {
    if (lastReceived && Array.isArray(lastReceived)) {
      console.log("RadioBoard received backend data", lastReceived);
      setRadios(prev => {
        const byUid = Object.fromEntries(prev.map(r => [r.uid, r]));
        lastReceived.forEach(serverRadio => {
          byUid[serverRadio.uid] = {
            ...byUid[serverRadio.uid],
            ...serverRadio,
            status: serverRadio.status ?? "online",
          };
        });
        return validate(Object.values(byUid));
      });
    }
  }, [lastReceived]);

  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

    const handleContextMenu = (e, radioUid) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, radioUid });
  };

  return (
    <div className="radio-page">
      <div className="topbar">
        <h2>Radio Config</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="btn" onClick={() => loadConfig(loaded => { nextId = Math.max(...loaded.map(r => r.uid)) + 1; 
              setRadios(validate(loaded)); })}>Load radio config</button>
            <button className="btn" onClick={() => downloadConfig(radios)}>Download config</button>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isConnected ? "#4be34b" : "#ff6b6b" }} />
          <span style={{ fontSize: "12px", color: "#888" }}>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {lastUpdated && <span style={{ fontSize: "12px", color: "#888" }}>Last updated: {lastUpdated}</span>}
      </div>
      <div className="cards-wrap">
        {radios.map((r, i) => (
          <div key={r.uid} onContextMenu={e => handleContextMenu(e, r.uid)}>
            <RadioCard
              key={r.uid}
              radio={r}
              index={i}
              onConfigChange={(index, paramIdx, value) => handleConfigChange(index, paramIdx, value, setRadios)}
              onStructChange={(index, text) => handleStructChange(index, text, setRadios)}
              onStructParse = {(index) => {handleStructParse(index, setRadios); setPanelRadioUid(radios[index].uid)}}
              onFieldChange={(index, fieldIdx, value) => handleFieldChange(index, fieldIdx, value, setRadios)}
              onRemove = {(index) => handleRemove(index, setRadios)}
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

      {/* ── Sliding panel ── */}
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
        />
      )}
      
    </div>
  );
}


export default RadioBoard;