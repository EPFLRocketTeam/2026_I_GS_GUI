import {TYPE_MAP } from "../constants/dataStructConstants"

const RADIO_CONSTANTS = {
  DEFAULT_TX_POWER: "22",
  DEFAULT_BW: "125",
  DEFAULT_SF: "7",
  DEFAULT_CR: "1",
  DEFAULT_PREAMBLE_LENGTH: "8",
  DEFAULT_CRC: "true",
  RADIO_TYPE_EMITTER: "RADIO_TYPE_EMITTER",
  RADIO_TYPE_RECEIVER: "RADIO_TYPE_RECEIVER",
};

const resolveValue = (value) => {
  const cleanValue = value.trim();
  return RADIO_CONSTANTS[cleanValue] ?? cleanValue;
};

const getControlFromType = (type) => {
  if (type === "bool" || type === "enum") return "select";
  return "number";
};

const toLabel = (key) => {
  const parts = key.split("_");

  const labelParts = parts.length > 1 ? parts.slice(1) : parts;

  return labelParts
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const parseRadioProfile = (raw = "") => {
  console.log("RAW PROFILE FILE:", raw);

  return raw
    .replace(/\u00A0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("#define"))
    .map((line) => {
      const match = line.match(
        /^#define\s+([A-Za-z_]\w*)\s+(.+?)\s*\((\w+)\)\s*$/,
      );

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
        value: resolveValue(value),
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
