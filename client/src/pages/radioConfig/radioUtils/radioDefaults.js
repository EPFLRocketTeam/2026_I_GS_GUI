import { validate } from "./radioIO";

export const RADIO_CONFIG_PARAMS = [
  { key: "frequency",    label: "Frequency",      type: "int32",  value: "864340000" },
  { key: "power",        label: "TX Power",        type: "int8",   value: "14" },
  { key: "bandwidth",    label: "Bandwidth",       type: "int8",   value: "7" },
  { key: "sf",           label: "Spread Factor",   type: "int8",   value: "7" },
  { key: "cr",           label: "Coding Rate",     type: "bool",   value: "false" },
  { key: "preamble_len", label: "Preamble Length", type: "int16",  value: "8" },
  { key: "crc",          label: "CRC",             type: "bool",   value: "true" },
  { key: "inverse_iq",   label: "Inverse IQ",      type: "bool",   value: "false" },
  { key: "send_mode",    label: "Send Mode",       type: "bool",   value: "false" },
];

export const createNewRadio = (nextIdRef) => {
  const uid = nextIdRef.current;
  nextIdRef.current += 1;
  return {
    uid,
    status: "offline",
    saved: false,
    configParams: RADIO_CONFIG_PARAMS.map(p => ({ ...p })),
    structText: "",
    structFields: [],
  }
};

export const DEFAULT_RADIOS = validate([
  {
    uid: 1,
    status: "waiting",
    saved: false,
    configParams: RADIO_CONFIG_PARAMS.map(p => ({ ...p })),
    structText: "",
    structFields: [],
  }
]);