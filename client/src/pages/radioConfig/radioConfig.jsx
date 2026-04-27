import { useState, useEffect, useRef } from "react";
import "./radioConfig.css";
import RadioCard from "../../components/radioCard/radioCard";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import RocketDataPanel from "../../components/rocketDataPanel/rocketDataPanel";
import RadioCardScroller  from "../../components/radioCardScroller/radioCardScroller";
import { 
  validate, downloadConfig, loadConfig, handleAdd,
  handleConfigChange, handleStructChange, handleStructParse, handleRemove,
  handleFieldChange, handleConfigTypeChange, handleConfigKeyChange,
  handleFieldLabelChange, handleFieldTypeChange,
} from "./radioUtils";
import { ensureRadioIds, RADIO_PROFILE_OPTIONS } from "./radioUtils/radioDefaults";
import { getRadioUid, uidCounts } from "./radioUtils/radioIO";
import { useNavigate } from "react-router-dom";
import useRadioDrag from "./radioUtils/radioDragUtils";
import DeleteRadioModal from "../../components/deleteRadioModal/deleteRadioModal";

function RadioConfig({radios, setRadios}) {
  const { lastUpdated, isConnected } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");
  const nextId = useRef(1);

  const [ctxMenu, setCtxMenu] = useState(null); 
  const [panelRadioId, setPanelRadioId] = useState(null);
  const [selectedRadioId, setSelectedRadioId] = useState(null);
  const [radioPendingDelete, setRadioPendingDelete] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState("uplink");

  const panelRadio = radios.find(r => r.id === panelRadioId) ?? null;
  const { draggedRadioId, dragOverRadioId, handleDragStart, handleDragEnter, handleDrop, handleDragEnd } = useRadioDrag(setRadios);

  const handleContextMenu = (e, radioId) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, radioId: radioId });
  };

  const navigate = useNavigate();

  const handleConfigDataStruct = (index) => {
    const radio = radios[index];

    navigate("/dataStructConfig", {
      state: {
        radioId: radio.id,
        radioUid: getRadioUid(radio),
        fields: radio.structFields ?? radio.initialFields ?? [],
      },
    });
  };

  const counts = uidCounts(radios);

  const selectRadioCard = (radioId) => {
    setSelectedRadioId(radioId);
  };

  useEffect(() => {
    if (!radios.length) {
      nextId.current = 1;
      return;
    }

    const maxUid = Math.max(...radios.map((r) => Number(getRadioUid(r)) || 0));
    if (maxUid >= nextId.current) {
      nextId.current = maxUid + 1;
    }
  }, [radios]);

  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="radio-page">
      <div className="topbar">
        <div className="topbar-left">
          <select
            className="btn"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
          >
            {RADIO_PROFILE_OPTIONS.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>

          <button
            className="btn btn-add-radio"
            onClick={() => handleAdd(setRadios, selectedProfile)}
          >
            + Add Radio
          </button>
        </div>
        <div className="topbar-right">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="btn" onClick={() => loadConfig(loaded => {
                const normalized = ensureRadioIds(loaded);
                nextId.current = Math.max(0, ...normalized.map(r => Number(getRadioUid(r)) || 0)) + 1;
                setRadios(validate(normalized));
              })}>Load radio config</button>
              <button className="btn" onClick={() => downloadConfig(radios)}>Download config</button>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isConnected ? "#4be34b" : "#ff6b6b" }} />
            <span style={{ fontSize: "12px", color: "#888" }}>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          {lastUpdated && <span style={{ fontSize: "12px", color: "#888" }}>Last updated: {lastUpdated}</span>}
        </div>
      </div>
      <div className={`cards-wrap ${radios.length === 0 ? "cards-wrap--empty" : ""}`}>
        <RadioCardScroller empty={radios.length === 0}>
          {radios.map((r, i) => (
            <div
              key={r.id}
              draggable
              className={`cards-item ${selectedRadioId === r.id ? "cards-item--selected" : ""} ${draggedRadioId === r.id ? "cards-item--dragging" : ""} ${dragOverRadioId === r.id ? "cards-item--drag-over" : ""}`}
              onClick={() => selectRadioCard(r.id)}
              onContextMenu={(e) => handleContextMenu(e, r.id)}
              onDragStart={() => handleDragStart(r.id)}
              onDragEnter={() => handleDragEnter(r.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(r.id)}
              onDragEnd={handleDragEnd}
            >
              <RadioCard
                radio={r}
                index={i}
                onConfigChange={(index, paramIdx, value) => handleConfigChange(index, paramIdx, value, setRadios)}
                onStructChange={(index, text) => handleStructChange(index, text, setRadios)}
                onStructParse = {(index) => {handleStructParse(index, setRadios); setPanelRadioId(radios[index].id)}}
                onFieldChange={(index, fieldIdx, value) => handleFieldChange(index, fieldIdx, value, setRadios)}
                onRemove = {(index) => setRadioPendingDelete({ index, radio: radios[index] })}
                onConfigTypeChange={(index, pIdx, value) => handleConfigTypeChange(index, pIdx, value, setRadios)}
                onConfigKeyChange={(index, pIdx, value) => handleConfigKeyChange(index, pIdx, value, setRadios)}
                isDuplicateUid={counts[getRadioUid(r)] > 1}
                onConfigDataStruct={(index) => handleConfigDataStruct(index)} 
              />
            </div>
          ))}
        </RadioCardScroller>
        </div>
        {radioPendingDelete && (
          <DeleteRadioModal
            radio={radioPendingDelete.radio}
            index={radioPendingDelete.index}
            onCancel={() => setRadioPendingDelete(null)}
            onConfirm={() => {
              handleRemove(radioPendingDelete.index, setRadios);
              setRadioPendingDelete(null);
            }}
          />
        )}
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