import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./digitalDisplayParams.css";

function DigitalDisplayParams({ displays = [], setDisplays, radios = [], setRadios }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const display = useMemo(
    () => displays.find((item) => item.id === id),
    [displays, id]
  );

  const [title, setTitle] = useState("");
  const [variable, setVariable] = useState("");
  const [suffix, setSuffix] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [originalVariable, setOriginalVariable] = useState("");

  const selectedField = useMemo(() => {
    if (!display) return null;
    const radio = radios.find((r) => r.id === display.radioId);
    if (!radio) return null;
    return (radio.structFields ?? []).find((field) => field.name === originalVariable);
  }, [display, radios, originalVariable]);

  useEffect(() => {
    if (!display) return;
    setTitle(display.title ?? "");
    setVariable(display.variable ?? "");
    setOriginalVariable(display.variable ?? "");
    setSuffix(display.suffix ?? "");

    const radio = radios.find((r) => r.id === display.radioId);
    const field = (radio?.structFields ?? []).find((f) => f.name === display.variable);
    setCurrentValue(field?.value ?? "");
  }, [display, radios]);

  if (!display) {
    return (
      <div className="ddp-page">
        <div className="ddp-card">
          <h2>Digital Display Parameters</h2>
          <p>Display not found.</p>
          <button className="ddp-btn" onClick={() => navigate("/")}>Back</button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const cleanVariable = variable.trim();
    setDisplays((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title,
              variable: cleanVariable,
              suffix,
            }
          : item
      )
    );

    if (setRadios) {
      setRadios((prev) =>
        prev.map((radio) => {
          if (radio.id !== display.radioId) return radio;

          return {
            ...radio,
            structFields: (radio.structFields ?? []).map((field) =>
              field.name === originalVariable
                ? { ...field, name: cleanVariable, value: currentValue }
                : field
            ),
          };
        })
      );
    }

    navigate("/");
  };

  return (
    <div className="ddp-page">
      <div className="ddp-card">
        <h2>Digital Display Parameters</h2>

        <div className="ddp-field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Engine Pressure" />
        </div>

        <div className="ddp-field">
          <label>Variable</label>
          <input value={variable} onChange={(e) => setVariable(e.target.value)} placeholder="chamber_pressure" />
        </div>

        <div className="ddp-field">
          <label>Suffix</label>
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="psi" />
        </div>

        <div className="ddp-field">
          <label>Current Value</label>
          <input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="Enter value" />
        </div>

        <div className="ddp-field ddp-field-info">
          <label>Linked radio / type</label>
          <div className="ddp-readonly">
            Radio {display.radioUid ?? "?"} · {selectedField?.type ?? display.type ?? "Unknown type"}
          </div>
        </div>

        <div className="ddp-actions">
          <button className="ddp-btn ddp-btn-secondary" onClick={() => navigate("/")}>Cancel</button>
          <button className="ddp-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default DigitalDisplayParams;