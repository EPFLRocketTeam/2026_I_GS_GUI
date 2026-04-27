const TYPE_MAP = {
  uint8: "uint8",
  uint16: "uint16",
  uint32: "uint32",
  int8: "int8",
  int16: "int16",
  int32: "int32",
  bool: "bool",
  enum: "enum",
};

const getControlFromType = (type) => {
  if (type === "bool" || type === "enum") return "select";
  return "number";
};

const toLabel = (key) =>
  key
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const parseRadioProfile = (raw = "") => {
  console.log("RAW PROFILE FILE:", raw);

  return raw
    .replace(/\u00A0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("#define"))
    .map((line) => {
      const match = line.match(/^#define\s+([A-Za-z_]\w*)\s+(.+?)\s*\((\w+)\)\s*$/);

      if (!match) {
        console.error("Invalid radio profile line:", line);
        return null;
      }

      const [, key, value, rawType] = match;
      const type = TYPE_MAP[rawType] ?? rawType;

      return {
        key,
        label: toLabel(key),
        type,
        control: getControlFromType(type),
        value: value.trim(),
        options:
          type === "bool"
            ? [
                { label: "true", value: "true" },
                { label: "false", value: "false" },
              ]
            : type === "enum"
              ? [
                  { label: "Emitter", value: "RADIO_TYPE_EMITTER" },
                  { label: "Receiver", value: "RADIO_TYPE_RECEIVER" },
                ]
              : undefined,
      };
    })
    .filter(Boolean);
};