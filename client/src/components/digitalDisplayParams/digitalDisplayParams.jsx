import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./digitalDisplayParams.css";

function DigitalDisplayParams({ displays, setDisplays }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const display = useMemo(() => displays.find((item) => item.id === id), [displays, id]);

  const [title, setTitle] = useState("");
  const [variable, setVariable] = useState("");
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    if (!display) return;
    setTitle(display.title ?? "");
    setVariable(display.variable ?? "");
    setSuffix(display.suffix ?? "");
  }, [display]);

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
    setDisplays((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title,
              variable,
              suffix,
            }
          : item
      )
    );

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

        <div className="ddp-actions">
          <button className="ddp-btn ddp-btn-secondary" onClick={() => navigate("/")}>Cancel</button>
          <button className="ddp-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default DigitalDisplayParams;