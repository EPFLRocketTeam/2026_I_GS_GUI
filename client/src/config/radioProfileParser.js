const TYPE_MAP = {
  int_8: "int8",
  int_16: "int16",
  int_32: "int32",
  uint_8: "uint8",
  uint_16: "uint16",
  uint_32: "uint32",
  float_8: "float8",
  float_16: "float16",
  float_32: "float_32",
  float_64: "float_64",
  bool: "bool",
};

const getControlFromType = (type) => {
  if (type === "bool") return "select";
  return "text";
};

const toLabel = (key) =>
  key
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const parseRadioProfile = (raw) => {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith("#define"))
    .map((line) => {
      const match = line.match(/^#define\s+(\w+)\s+(.+?)\s+\((\w+)\)$/);

      if (!match) {
        throw new Error(`Invalid radio profile line: ${line}`);
      }

      const [, key, value, rawType] = match;
      const type = TYPE_MAP[rawType] ?? rawType;

      return {
        key,
        label: toLabel(key),
        type,
        control: getControlFromType(type),
        value,
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
    });
};