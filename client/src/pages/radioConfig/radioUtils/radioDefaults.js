import { parseRadioProfile } from "../../../config/radioProfileParser";
import { RADIO_PROFILE_FILES } from "../../../config/radioProfiles";

console.log("RADIO_PROFILE_FILES:", RADIO_PROFILE_FILES);

export const RADIO_CONFIG_TEMPLATES = Object.fromEntries(
  Object.entries(RADIO_PROFILE_FILES).map(([key, profile]) => {
    console.log("PROFILE RAW BEFORE PARSE:", key, profile.raw);
    const parsed = parseRadioProfile(profile.raw);

    console.log("PROFILE:", key, parsed);
    console.log("PROFILE PARSED:", key, parsed);
    return [key, parsed];
  })
);

export const RADIO_PROFILE_OPTIONS = Object.entries(RADIO_PROFILE_FILES).map(
  ([key, profile]) => ({
    value: key,
    label: profile.label,
  })
);

export const cloneConfigParams = (templateName = "uplink") => {
  const template =
    RADIO_CONFIG_TEMPLATES[templateName] ?? RADIO_CONFIG_TEMPLATES.uplink ?? [];

  return template.map((p) => ({
    ...p,
    options: p.options ? p.options.map((o) => ({ ...o })) : undefined,
  }));
};

export const createNewRadio = (radios, templateName = "uplink") => {
  const configParams = cloneConfigParams(templateName);

  console.log("CREATING RADIO WITH TEMPLATE:", templateName, configParams);

  const usedUids = new Set(
    radios
      .map((r) => {
        const uidParam = r.configParams?.find(
          (p) => p.key?.toLowerCase() === "uid"
        );
        return Number(uidParam?.value);
      })
      .filter((n) => !Number.isNaN(n))
  );

  let uid = 0;
  while (usedUids.has(uid)) uid++;

  return {
    id: crypto.randomUUID(),
    status: "online",
    saved: false,
    configTemplate: templateName,
    configParams: configParams.map((p) => ({
      ...p,
      value: p.key?.toLowerCase() === "uid" ? String(uid) : p.value,
    })),
    structText: "",
    structFields: [],
    errors: [],
  };
};

export const DEFAULT_RADIOS = [createNewRadio([], "uplink")];

export const ensureRadioIds = (radios) =>
  radios.map((r) => ({
    ...r,
    id: r.id ?? crypto.randomUUID(),
    configParams: r.configParams ?? cloneConfigParams(r.configTemplate ?? "uplink"),
    structText: r.structText ?? "",
    structFields: r.structFields ?? [],
  }));

export function clampValue(value, min, max) {
  if (value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  if (min != null && num < min) return String(min);
  if (max != null && num > max) return String(max);
  return String(num);
}

export const switchRadioConfigTemplate = (radios, radioId, templateName) => {
  return radios.map((radio) => {
    if (radio.id !== radioId) return radio;

    const currentUid =
      radio.configParams?.find((p) => p.key?.toLowerCase() === "uid")?.value ??
      "0";

    return {
      ...radio,
      configTemplate: templateName,
      configParams: cloneConfigParams(templateName).map((p) => ({
        ...p,
        value: p.key?.toLowerCase() === "uid" ? currentUid : p.value,
      })),
    };
  });
};