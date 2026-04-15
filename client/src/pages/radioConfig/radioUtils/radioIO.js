export const validate = (radios) =>
  radios.map(r => ({ ...r, errors: [] }));

export const parseStruct = (structText) => {
  const lines = structText
    .replace(/\/\/[^\n]*/g, "")     
    .replace(/\/\*[\s\S]*?\*\//g, "") 
    .replace(/[{}]/g, "")   
    .split(";")
    .map(s => s.trim())
    .filter(Boolean);

  return lines.map(line => {
    const match = line.match(/^([\w\s*]+?)\s+(\w+)\s*$/);
    if (!match) return null;
    const [, rawType, name] = match;
    return { key: name, label: name, type: rawType.trim(), value: "" };
  }).filter(Boolean);
};

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
        onSuccess(parsed.map(radio => ({ ...radio, saved: false })));
      } catch {
        alert("Invalid config file — must be a JSON array.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

export const getRadioUid = (radio) =>
  String(
    radio.uid ??
    radio.configParams?.find((p) => p.key === "uid")?.value ??
    ""
  ).trim();

export const uidCounts = (radios) => radios.reduce((acc, r) => {
  const uid = getRadioUid(r);
  if (!uid) return acc;
  acc[uid] = (acc[uid] ?? 0) + 1;
  return acc;
}, {});