import { validate } from "./radioIO";

export const RADIO_CONFIG_PARAMS = [
  { key: "uid",    label: "uid",      type: "uint32",  value: "" },
  { key: "frequency",    label: "Frequency",      type: "uint32",  value: "" },
  { key: "power",        label: "TX Power",        type: "uint32",   value: "" },
  { key: "bandwidth",    label: "Bandwidth",       type: "uint32",   value: "" },
  { key: "sf",           label: "Spread Factor",   type: "uint32",   value: "" },
  { key: "cr",           label: "Coding Rate",     type: "uint32",   value: "" },
  { key: "preamble_len", label: "Preamble Length", type: "uint32",  value: "" },
  { key: "crc",          label: "CRC",             type: "uint32",   value: "" },
  { key: "inverse_iq",   label: "Inverse IQ",      type: "uint32",   value: "" },
  { key: "send_mode",    label: "Send Mode",       type: "uint32",   value: "" },
];

export const createNewRadio = (radios) => {
  const usedUids = new Set(
    radios.map(r => {
      const uidParam = r.configParams?.find(p => p.key === "uid");
      return Number(uidParam?.value);
    }).filter(n => !Number.isNaN(n))
  );

  let uid = 0;
  while (usedUids.has(uid)) uid++;

  return {
    id: crypto.randomUUID(),
    status: "online",
    saved: false,
    configParams: RADIO_CONFIG_PARAMS.map(p => ({
      ...p,
      value: p.key === "uid" ? String(uid) : p.value,
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
