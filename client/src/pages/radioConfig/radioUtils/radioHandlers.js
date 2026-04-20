import { validate, parseStruct } from "./radioIO";
import { createNewRadio, clampValue } from "./radioDefaults";

export const handleAdd = (setRadios) => {
  setRadios(prev => {
    const newRadio = createNewRadio(prev);
    return validate([newRadio, ...prev]);
  });
};

export const handleRemove = (index, setRadios) => {
  setRadios(prev => validate(prev.filter((_, i) => i !== index)));
};

export const handleConfigChange = (radioIdx, paramIdx, value, setRadios) => {
  setRadios(prev =>
    prev.map((radio, i) => {
      if (i !== radioIdx) return radio;

      const configParams = radio.configParams.map((param, pIdx) => {
        if (pIdx !== paramIdx) return param;

        let nextValue = value;

        if (param.control === "number") {
          nextValue = clampValue(value, param.min, param.max);
        }

        return {
          ...param,
          value: nextValue,
        };
      });

      return {
        ...radio,
        configParams,
      };
    })
  );
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

export const moveRadio = (list, fromId, toId) => {
  const fromIndex = list.findIndex((r) => r.id === fromId);
  const toIndex = list.findIndex((r) => r.id === toId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return list;
  }

  const updated = [...list];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
};

