import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./digitalDisplayParams.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";
import { DigitalDisplay } from "../../interfaces/dashboardInterfaces/dashboardInterfaces";

type Props = {
  displays: DigitalDisplay[];
  setDisplays: React.Dispatch<React.SetStateAction<DigitalDisplay[]>>;
  radios: any[]; // TODO: This should be typed according to the structure of a radio in your application.
};

function DigitalDisplayParams({
  displays = [],
  setDisplays,
  radios = [],
}: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const display = useMemo(
    () => displays.find((item) => item.digitalDisplayId === id),
    [displays, id],
  );

  const [title, setTitle] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  // const [suffix, setSuffix] = useState("");

  const variableOptions = useMemo(() => {
    return radios.flatMap((radio) =>
      (radio.structFields ?? []).map((field: any) => {
        const radioUid = getRadioUid(radio);

        return {
          key: `${radio.id}::${field.name}`,
          radioId: radio.id,
          radioUid,
          name: field.name,
          type: field.type,
          address: field.address,
          value: field.value,
        };
      }),
    );
  }, [radios]);

  const selectedField = useMemo(() => {
    return variableOptions.find((option) => option.key === selectedKey) ?? null;
  }, [variableOptions, selectedKey]);

  useEffect(() => {
    if (!display) return;

    setTitle(display.title ?? "");
    // setSuffix(display.suffix ?? "");

    const key =
      display.radioId && display.varName
        ? `${display.radioId}::${display.varName}`
        : "";

    setSelectedKey(key);
  }, [display, variableOptions]);

  if (!display) {
    return (
      <div className="ddp-page">
        <div className="ddp-card">
          <h2>Digital Display Parameters</h2>
          <p>Display not found.</p>
          <button className="ddp-btn" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setDisplays((prev) =>
      prev.map((item) =>
        item.digitalDisplayId === id
          ? {
              ...item,
              title: title.trim() || "Untitled display",
              varName: selectedField?.name ?? "",
              radioId: selectedField?.radioId ?? null,
              radioUid: selectedField?.radioUid ?? "",
              type: selectedField?.type ?? "",
              address: selectedField?.address ?? null,
              // suffix,
            }
          : item,
      ),
    );

    navigate("/");
  };

  console.log("RADIOS IN PARAMS:", radios);

  return (
    <div className="ddp-page">
      <div className="ddp-card">
        <h2>Digital Display Parameters</h2>

        <div className="ddp-field">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled display"
          />
        </div>

        <div className="ddp-field">
          <label>Variable</label>
          <select
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value);
            }}
          >
            <option value="">No variable selected</option>

            {variableOptions.map((option) => (
              <option key={option.key} value={option.key}>
                Radio {option.radioUid} · {option.name} ·{" "}
                {option.type || "Unknown type"}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="ddp-field">
          <label>Suffix</label>
          <input
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="psi"
          />
        </div> */}

        <div className="ddp-field ddp-field-info">
          <label>Linked radio / type</label>
          <div className="ddp-readonly">
            {selectedField
              ? `Radio ${selectedField.radioUid} · ${selectedField.type || "Unknown type"}`
              : "No variable linked"}
          </div>
        </div>

        <div className="ddp-actions">
          <button
            className="ddp-btn ddp-btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button className="ddp-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalDisplayParams;
