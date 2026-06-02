import { RADIO_TYPES } from "../constants/radioProfileConstants";
import { RadioProfile } from "../interfaces/radioInterfaces";

const REQUIRED_PROFILE_KEYS: (keyof RadioProfile)[] = [
  "DEFAULT_TX_POWER",
  "DEFAULT_BW",
  "DEFAULT_SF",
  "DEFAULT_CR",
  "DEFAULT_PREAMBLE_LENGTH",
  "DEFAULT_CRC",
  "RADIO_TYPE",
];

const parseNumberValue = (value: string): number => {
  const cleanValue = value.trim();
  const parsed = Number(cleanValue);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number value: ${value}`);
  }

  return parsed;
};

const parseBooleanValue = (value: string): boolean => {
  const cleanValue = value.trim().toLowerCase();

  if (cleanValue === "true" || cleanValue === "1") return true;
  if (cleanValue === "false" || cleanValue === "0") return false;

  throw new Error(`Invalid boolean value: ${value}`);
};

const parseRadioTypeValue = (value: string): RADIO_TYPES => {
  const cleanValue = value.trim();

  if (cleanValue in RADIO_TYPES) {
    return RADIO_TYPES[cleanValue as keyof typeof RADIO_TYPES];
  }

  const values = Object.values(RADIO_TYPES) as string[];

  if (values.includes(cleanValue)) {
    return cleanValue as RADIO_TYPES;
  }

  throw new Error(`Invalid radio type value: ${value}`);
};

const assignProfileValue = (
  profile: Partial<RadioProfile>,
  key: string,
  value: string,
) => {
  switch (key) {
    case "DEFAULT_TX_POWER":
      profile.DEFAULT_TX_POWER = parseNumberValue(value);
      break;

    case "DEFAULT_BW":
      profile.DEFAULT_BW = parseNumberValue(value);
      break;

    case "DEFAULT_SF":
      profile.DEFAULT_SF = parseNumberValue(value);
      break;

    case "DEFAULT_CR":
      profile.DEFAULT_CR = parseNumberValue(value);
      break;

    case "DEFAULT_PREAMBLE_LENGTH":
      profile.DEFAULT_PREAMBLE_LENGTH = parseNumberValue(value);
      break;

    case "DEFAULT_CRC":
      profile.DEFAULT_CRC = parseBooleanValue(value);
      break;

    case "RADIO_TYPE":
      profile.RADIO_TYPE = parseRadioTypeValue(value);
      break;

    default:
      console.warn(`Unknown radio profile key ignored: ${key}`);
      break;
  }
};

const validateRadioProfile = (
  profile: Partial<RadioProfile>,
): RadioProfile => {
  const missingKeys = REQUIRED_PROFILE_KEYS.filter(
    (key) => profile[key] === undefined,
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing radio profile values: ${missingKeys.join(", ")}`,
    );
  }

  return profile as RadioProfile;
};

export const parseRadioProfile = (raw = ""): RadioProfile => {
  console.log("RAW PROFILE FILE:", raw);

  const profile: Partial<RadioProfile> = {};

  raw
    .replace(/\u00A0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("#define"))
    .forEach((line) => {
      const match = line.match(
        /^#define\s+([A-Za-z_]\w*)\s+(.+?)\s*\((\w+)\)\s*$/,
      );

      if (!match) {
        throw new Error(`Invalid radio profile line: ${line}`);
      }

      const [, key, value] = match;

      assignProfileValue(profile, key, value);
    });

  return validateRadioProfile(profile);
};