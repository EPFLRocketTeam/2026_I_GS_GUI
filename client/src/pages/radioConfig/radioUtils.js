export const downloadConfig = (radios) => {
  const config = radios.map(({ errors, saved, ...radio }) => radio);
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `radio-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const loadConfig = (onSuccess) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        const loaded = parsed.map(radio => ({
          ...radio,
          saved: false,
          pins: Array.isArray(radio.pins) ? radio.pins : [],
        }));
        onSuccess(loaded);
      } catch {
        alert("Invalid config file — must be a JSON array of radio objects.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

export const validate = (radios) => {
  const ids = radios.map(r => r.idVal);
  return radios.map(r => ({
    ...r,
    errors: ids.filter(id => id === r.idVal).length > 1 ? ["Same ID used twice"] : [],
  }));
};

export const createNewRadio = (nextId) => ({
  uid: nextId,
  status: "offline",
  saved: false,
  configParams: RADIO_CONFIG_PARAMS.map(p => ({ ...p })),
  structText: "",
  structFields: [], 
});

export const handleChange = (index, field, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    updated[index] = { ...updated[index], [field]: value };
    return validate(updated);
  });
};

export const handlePinChange = (index, pinIdx, field, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const pins = [...updated[index].pins];
    pins[pinIdx] = { ...pins[pinIdx], [field]: value };
    updated[index] = { ...updated[index], pins };
    return validate(updated);
  });
};

export const handleAddPin = (index, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    updated[index] = {
      ...updated[index],
      pins: [...updated[index].pins, { key: Date.now().toString(), label: "", unit: "", value: "", type: "" }]
    };
    return validate(updated);
  });
};

export const handleRemovePin = (index, pinIdx, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const pins = updated[index].pins.filter((_, i) => i !== pinIdx);
    updated[index] = { ...updated[index], pins };
    return validate(updated);
  });
};


// Fixed config parameters for every radio (label, key, type, default value)
export const RADIO_CONFIG_PARAMS = [
  { key: "frequency",     label: "Frequency",       type: "int32",  value: "864340000" },
  { key: "power",         label: "TX Power",         type: "int8",   value: "14" },
  { key: "bandwidth",     label: "Bandwidth",        type: "int8",   value: "7" },
  { key: "sf",            label: "Spread Factor",   type: "int8",   value: "7" },
  { key: "cr",            label: "Coding Rate",      type: "bool",   value: "false" },
  { key: "preamble_len",  label: "Preamble Length",  type: "int16",  value: "8" },
  { key: "crc",           label: "CRC",              type: "bool",   value: "true" },
  { key: "inverse_iq",    label: "Inverse IQ",       type: "bool",   value: "false" },
  { key: "send_mode",     label: "Send Mode",        type: "bool",   value: "false" },
];

export const DEFAULT_RADIOS = validate([
  {  uid: 1,
        status: "waiting",
        saved: false,
        configParams: RADIO_CONFIG_PARAMS.map(p => ({ ...p })),
        structText: "",
        structFields: [],}
]);

// Parse a C struct body into an array of { key, label, type, value }
export const parseStruct = (structText) => {
  const lines = structText
    .replaceAll(/\/\/[^\n]*/g, "")   // strip // comments
    .replaceAll(/\/\*[\s\S]*?\*\//g, "") // strip /* */ comments
    .split(";")
    .map(s => s.trim())
    .filter(Boolean);

  return lines.map(line => {
    const match = line.match(/^([\w\s*]+?)\s+(\w+)\s*$/);
    if (!match) return null;
    const [, rawType, name] = match;
    return {
      key: name,
      label: name,
      type: rawType.trim(),
      value: "",
    };
  }).filter(Boolean);
};

export const handleAdd = (nextId, setRadios) => {
     const newRadio = createNewRadio(nextId.current);
    nextId.current += 1;
    setRadios(prev => validate([...prev, newRadio]));
  };

export const handleRemove = (index, setRadios) => {
    setRadios(prev => validate(prev.filter((_, i) => i !== index)));
  };

export const handleConfigChange = (radioIdx, paramIdx, value, setRadios) => {
    setRadios(prev => {
      const updated = [...prev];
      const params = [...updated[radioIdx].configParams];
      params[paramIdx] = { ...params[paramIdx], value };
      updated[radioIdx] = { ...updated[radioIdx], configParams: params };
      return validate(updated);
    });
  };

export const handleStructChange = (radioIdx, text, setRadios) => {
    setRadios(prev => {
      const updated = [...prev];
      updated[radioIdx] = { ...updated[radioIdx], structText: text };
      return updated;
    });
  };

  
export const handleStructParse = (radioIdx, setRadios) => {
    setRadios(prev => {
      const updated = [...prev];
      const fields = parseStruct(updated[radioIdx].structText);
      updated[radioIdx] = { ...updated[radioIdx], structFields: fields };
      return validate(updated);
    });
  };

export const handleFieldChange = (radioIdx, fieldIdx, value, setRadios) => {
    setRadios(prev => {
      const updated = [...prev];
      const fields = [...updated[radioIdx].structFields];
      fields[fieldIdx] = { ...fields[fieldIdx], value };
      updated[radioIdx] = { ...updated[radioIdx], structFields: fields };
      return validate(updated);
    });
  };