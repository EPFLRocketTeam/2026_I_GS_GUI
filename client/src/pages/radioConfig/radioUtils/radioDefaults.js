import { validate } from "./radioIO";

export const RADIO_CONFIG_PARAMS = [
  {
    key: "uid",
    label: "uid",
    type: "uint32",
    control: "number",
    min: 0,
    max: 4294967295,
    maxLength: 10,
    value: "",
  },
  {
    key: "frequency",
    label: "Frequency",
    type: "uint32",
    control: "number",
    min: 0,
    max: 4294967295,
    maxLength: 10,
    value: "",
  },
  {
    key: "power",
    label: "TX Power",
    type: "uint8",
    control: "number",
    min: 0,
    max: 255,
    maxLength: 3,
    value: "",
  },
  {
    key: "bandwidth",
    label: "Bandwidth",
    type: "uint32",
    control: "number",
    min: 0,
    max: 1000000,
    maxLength: 10,
    value: "",
  },
  {
    key: "sf",
    label: "Spread Factor",
    type: "uint32",
    control: "number",
    min: 0,
    max: 12,
    maxLength: 2,
    value: "",
  },
  {
    key: "cr",
    label: "Coding Rate",
    type: "uint32",
    control: "number",
    min: 0,
    max: 4,
    maxLength: 1,
    value: "",
  },
  {
    key: "preamble_len",
    label: "Preamble Length",
    type: "uint32",
    control: "number",
    min: 0,
    max: 10000,
    maxLength: 5,
    value: "",
  },
  {
    key: "crc",
    label: "CRC",
    type: "uint32",
    control: "number",
    min: 0,
    max: 1,
    maxLength: 1,
    value: "",
  },
  {
    key: "inverse_iq",
    label: "Inverse IQ",
    type: "uint32",
    control: "number",
    min: 0,
    max: 1,
    maxLength: 1,
    value: "",
  },
  {
    key: "operating_mode",
    label: "Operating Mode",
    type: "enum",
    control: "select",
    options: [
      { label: "Emitter", value: "emitter" },
      { label: "Receiver", value: "receiver" },
    ],
    value: "emitter",
  },
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

export function clampValue(value, min, max) {
  if (value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  if (min != null && num < min) return String(min);
  if (max != null && num > max) return String(max);
  return String(num);
}

