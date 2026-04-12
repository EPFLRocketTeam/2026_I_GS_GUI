import { validate } from "./radioIO";
import { parseStruct } from "./radioIO";
import { createNewRadio } from "./radioDefaults";

export const handleAdd = (nextIdRef, setRadios) => {
  const newRadio = createNewRadio(nextIdRef);
  setRadios(prev => validate([...prev, newRadio]));
};

export const handleRemove = (index, setRadios) => {
  setRadios(prev => validate(prev.filter((_, i) => i !== index)));
};

export const handleConfigChange = (radioIdx, paramIdx, value, setRadios) => {
  setRadios((prev) => {
    const updated = prev.map((radio, rIdx) => {
      if (rIdx !== radioIdx) return radio;

      const configParams = (radio.configParams ?? []).map((param, pIdx) =>
        pIdx !== paramIdx ? param : { ...param, value }
      );

      const changedParam = configParams[paramIdx];

      return {
        ...radio,
        configParams,
        ...(changedParam?.key === "uid" ? { uid: value } : {}),
      };
    });

    return validate(updated);
  });
};

export const handleConfigLabelChange = (radioIdx, paramIdx, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const params = [...updated[radioIdx].configParams];
    params[paramIdx] = { ...params[paramIdx], label: value };
    updated[radioIdx] = { ...updated[radioIdx], configParams: params };
    return validate(updated);
  });
};

export const handleConfigTypeChange = (radioIdx, paramIdx, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const params = [...updated[radioIdx].configParams];
    params[paramIdx] = { ...params[paramIdx], type: value };
    updated[radioIdx] = { ...updated[radioIdx], configParams: params };
    return validate(updated);
  });
};

export const handleConfigKeyChange = (radioIdx, paramIdx, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const params = [...updated[radioIdx].configParams];
    params[paramIdx] = { ...params[paramIdx], key: value };
    updated[radioIdx] = { ...updated[radioIdx], configParams: params };
    return validate(updated);
  });
};

export const handleAddConfigParam = (radioIdx, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    updated[radioIdx] = {
      ...updated[radioIdx],
      configParams: [
        ...(updated[radioIdx].configParams ?? []),
        { key: Date.now().toString(), label: "", type: "", value: "" }
      ]
    };
    return validate(updated);
  });
};

export const handleRemoveConfigParam = (radioIdx, paramIdx, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    updated[radioIdx] = {
      ...updated[radioIdx],
      configParams: updated[radioIdx].configParams.filter((_, i) => i !== paramIdx)
    };
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

export const handleFieldLabelChange = (radioIdx, fieldIdx, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const fields = [...updated[radioIdx].structFields];
    fields[fieldIdx] = { ...fields[fieldIdx], label: value };
    updated[radioIdx] = { ...updated[radioIdx], structFields: fields };
    return validate(updated);
  });
};

export const handleFieldTypeChange = (radioIdx, fieldIdx, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    const fields = [...updated[radioIdx].structFields];
    fields[fieldIdx] = { ...fields[fieldIdx], type: value };
    updated[radioIdx] = { ...updated[radioIdx], structFields: fields };
    return validate(updated);
  });
};

export const handleUidChange = (index, value, setRadios) => {
  setRadios(prev => {
    const updated = [...prev];
    updated[index] = { ...updated[index], uid: value };
    return validate(updated);
  });
};
