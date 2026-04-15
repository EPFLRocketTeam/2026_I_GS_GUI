import { validate } from "./radioIO";

export const RADIO_CONFIG_PARAMS = [
  { key: "uid",    label: "uid",      type: "uint32",  value: "1" },
  { key: "frequency",    label: "Frequency",      type: "uint32",  value: "864340000" },
  { key: "power",        label: "TX Power",        type: "uint32",   value: "14" },
  { key: "bandwidth",    label: "Bandwidth",       type: "uint32",   value: "7" },
  { key: "sf",           label: "Spread Factor",   type: "uint32",   value: "7" },
  { key: "cr",           label: "Coding Rate",     type: "uint32",   value: "false" },
  { key: "preamble_len", label: "Preamble Length", type: "uint32",  value: "8" },
  { key: "crc",          label: "CRC",             type: "uint32",   value: "true" },
  { key: "inverse_iq",   label: "Inverse IQ",      type: "uint32",   value: "false" },
  { key: "send_mode",    label: "Send Mode",       type: "uint32",   value: "false" },
];

export const createNewRadio = (nextIdRef) => {
  const uid = String(nextIdRef.current);
  nextIdRef.current += 1;

  return {
    id: crypto.randomUUID(),
    status: "online",
    saved: false,
    configParams: RADIO_CONFIG_PARAMS.map(p => ({
      ...p,
      value: p.key === "uid" ? uid : p.value,
    })),
    structText: "",
    structFields: [],
  }
};

export const DEFAULT_RADIOS = validate([
  {
    id: crypto.randomUUID(),
    status: "online",
    saved: false,
    configParams: RADIO_CONFIG_PARAMS.map(p => ({ ...p })),
    structText: "",
    structFields: [],
  }
]);

export const ensureRadioIds = (radios) =>
  radios.map(r => ({
    ...r,
    id: r.id ?? crypto.randomUUID(),
  }));
