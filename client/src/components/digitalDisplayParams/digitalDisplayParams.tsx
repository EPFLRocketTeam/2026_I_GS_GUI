import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./digitalDisplayParams.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";
import { DigitalDisplayParamsProps } from "../../types/types";
import { DIGITAL_DISPLAY_PARAMS_TITLE, DISPLAY_NOT_FOUND, BACK_BUTTON, TITLE_LABEL, 
  UNTITLED_DISPLAY_TEXT, VARIABLE_LABEL, NO_VARIABLE_SELECTED_TEXT, UNKNOWN_TYPE,
  LINKED_RADIO_TYPE, 
  CANCEL_CHANGES,
  SAVE_CHANGES} 
  from "../../constants/digitalDisplayCardConstants";

function DigitalDisplayParams({
  displays = [],
  setDisplays,
  radios = [],
}: Readonly<DigitalDisplayParamsProps>) {
  const { id } = useParams();
  const navigate = useNavigate();

  const display = useMemo(
    () => displays.find((item) => item.digitalDisplayId === id),
    [displays, id],
  );

  const [title, setTitle] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const variableOptions = useMemo(() => {
    return radios.flatMap((radio) =>
      (radio.structFields ?? []).map((field: any) => {
        const radioUid = getRadioUid(radio);

        return {   // TOD0: Change this return as soon as you change RadioCard
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
          <h2>{DIGITAL_DISPLAY_PARAMS_TITLE}</h2>
          <p>{DISPLAY_NOT_FOUND}</p>
          <button className="ddp-btn" onClick={() => navigate("/")}>
            {BACK_BUTTON}
          </button>
        </div>
      </div>
    );
  }

  //TODO: Move handlers to new utilities file
  const handleSave = () => {
    setDisplays((prev) =>
      prev.map((item) =>
        item.digitalDisplayId === id
          ? {
              ...item,                              // TODO: also change this to adapt to radioStruct
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

  return (
    <div className="ddp-page">
      <div className="ddp-card">
        <h2>{DIGITAL_DISPLAY_PARAMS_TITLE}</h2>

        <div className="ddp-field">
          <label>{TITLE_LABEL}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={UNTITLED_DISPLAY_TEXT}
          />
        </div>

        <div className="ddp-field">
          <label>{VARIABLE_LABEL}</label>
          <select
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value);
            }}
          >
            <option value="">{NO_VARIABLE_SELECTED_TEXT}</option>

            {variableOptions.map((option) => (  //TODO: Formatting could be done in a separate function
              <option key={option.key} value={option.key}> 
                Radio {option.radioUid} · {option.name} ·{" "}
                {option.type || UNKNOWN_TYPE}
              </option>
            ))}
          </select>
        </div>
        <div className="ddp-field ddp-field-info">
          <span className="ddp-label">{LINKED_RADIO_TYPE}</span>
          <div className="ddp-readonly">
            {selectedField    //TODO: Also separate formatting into a separate function
              ? `Radio ${selectedField.radioUid} · ${selectedField.type || UNKNOWN_TYPE}`
              : "No variable linked"}
          </div>
        </div>

        <div className="ddp-actions">
          <button
            className="ddp-btn ddp-btn-secondary"
            onClick={() => navigate("/")}
          >
            {CANCEL_CHANGES}
          </button>
          <button className="ddp-btn" onClick={handleSave}>
            {SAVE_CHANGES}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalDisplayParams;
