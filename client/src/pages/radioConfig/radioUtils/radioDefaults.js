import { validate } from "./radioIO";
import uplinkRaw from "../../../config/radioProfiles/uplink.radio.h?raw";
import downlinkRaw from "../../../config/radioProfiles/downlink.radio.h?raw";
import { parseRadioProfile } from "../../../config/radioProfileParser";

export const RADIO_CONFIG_PARAMS = parseRadioProfile(uplinkRaw);
export const DOWNLINK_RADIO_CONFIG_PARAMS = parseRadioProfile(downlinkRaw);

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

