import { RADIO_TYPES } from "../../../constants/radioProfileConstants";
import { TYPE_MAP } from "../../../constants/dataStructConstants";
import type {
  Radio,
  RadioConfigParam,
} from "../../../interfaces/radioInterfaces";
import type { RadioConfigControl } from "../../../types/types";

const DEFAULT_TEMPLATE_NAME = "uplink";

const UPLINK_RADIO_RAW = `
#define DEFAULT_TX_POWER 14 (uint8)
#define DEFAULT_BW 125 (uint8)
#define DEFAULT_SF 7 (uint8)
#define DEFAULT_CR true (bool)
#define DEFAULT_PREAMBLE_LENGTH 8 (uint16)
#define DEFAULT_CRC true (bool)
#define DEFAULT_OPERATING_MODE RADIO_TYPE_EMITTER (enum)

#define UID 0 (uint32)
#define UPLINK_FREQUENCY 864.34E6 (uint32)
#define UPLINK_POWER DEFAULT_TX_POWER (uint8)
#define UPLINK_BW DEFAULT_BW (uint8)
#define UPLINK_SF DEFAULT_SF (uint8)
#define UPLINK_CR DEFAULT_CR (bool)
#define UPLINK_PREAMBLE_LEN DEFAULT_PREAMBLE_LENGTH (uint16)
#define UPLINK_CRC DEFAULT_CRC (bool)
#define UPLINK_INVERSE_IQ false (bool)
#define OPERATING_MODE DEFAULT_OPERATING_MODE (enum)
`;

const BOOL_OPTIONS = [
  { label: "true", value: "true" },
  { label: "false", value: "false" },
];

const RADIO_TYPE_OPTIONS = [
  { label: "Emitter", value: RADIO_TYPES.EMISSION },
  { label: "Receiver", value: RADIO_TYPES.RECEPTION },
];

const RADIO_ENUM_CONSTANTS: Record<string, string> = {
  RADIO_TYPE_EMITTER: RADIO_TYPES.EMISSION,
  RADIO_TYPE_RECEIVER: RADIO_TYPES.RECEPTION,
};

const getControlFromType = (type: string): RadioConfigControl => {
  if (type === "bool" || type === "enum") {
    return "select";
  }

  return "number";
};

const getOptionsByType = (type: string) => {
  if (type === "bool") {
    return BOOL_OPTIONS;
  }

  if (type === "enum") {
    return RADIO_TYPE_OPTIONS;
  }

  return undefined;
};

const toLabel = (key: string): string => {
  return key
    .replace(/^UPLINK_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

type ParsedDefineLine = {
  key: string;
  rawValue: string;
  rawType: string;
};

const parseDefineLines = (raw: string): ParsedDefineLine[] => {
  return raw
    .replace(/\u00A0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("#define"))
    .map((line) => {
      const match = line.match(
        /^#define\s+([A-Za-z_]\w*)(?:\s+(.+?))?\s*\((\w+)\)\s*$/,
      );

      if (!match) {
        throw new Error(`Invalid uplink radio line: ${line}`);
      }

      const [, key, rawValue = "", rawType] = match;

      return {
        key,
        rawValue: rawValue.trim(),
        rawType,
      };
    });
};

const buildDefaultValueMap = (
  lines: ParsedDefineLine[],
): Record<string, string> => {
  const defaults: Record<string, string> = {};

  lines.forEach(({ key, rawValue }) => {
    if (!key.startsWith("DEFAULT_")) return;

    defaults[key] =
      RADIO_ENUM_CONSTANTS[rawValue] ?? rawValue;
  });

  return defaults;
};

const resolveInitialValue = (
  rawValue: string,
  defaultValues: Record<string, string>,
): string => {
  if (!rawValue) return "";

  if (rawValue in defaultValues) {
    return defaultValues[rawValue];
  }

  if (rawValue in RADIO_ENUM_CONSTANTS) {
    return RADIO_ENUM_CONSTANTS[rawValue];
  }

  if (rawValue.startsWith("DEFAULT_")) {
    return "";
  }

  return rawValue;
};

const parseUplinkRadioConfig = (raw: string): RadioConfigParam[] => {
  const lines = parseDefineLines(raw);
  const defaultValues = buildDefaultValueMap(lines);

  return lines
    .filter(({ key }) => !key.startsWith("DEFAULT_"))
    .map(({ key, rawValue, rawType }) => {
      const type = TYPE_MAP[rawType as keyof typeof TYPE_MAP] ?? rawType;

      return {
        key,
        label: toLabel(key),
        value: resolveInitialValue(rawValue, defaultValues),
        control: getControlFromType(type),
        options: getOptionsByType(type)?.map((option) => ({ ...option })),
      };
    });
};

export const RADIO_CONFIG_TEMPLATES: Record<string, RadioConfigParam[]> = {
  [DEFAULT_TEMPLATE_NAME]: parseUplinkRadioConfig(UPLINK_RADIO_RAW),
};

export const RADIO_PROFILE_OPTIONS = [
  {
    value: DEFAULT_TEMPLATE_NAME,
    label: "Uplink",
  },
];

export const cloneConfigParams = (): RadioConfigParam[] => {
  const template = RADIO_CONFIG_TEMPLATES[DEFAULT_TEMPLATE_NAME];

  return template.map((param) => ({
    ...param,
    options: param.options
      ? param.options.map((option) => ({ ...option }))
      : undefined,
  }));
};

export const createNewRadio = (): Radio => ({
  id: crypto.randomUUID(),
  status: "online" as Radio["status"],
  configParams: cloneConfigParams(),
});

export const DEFAULT_RADIOS: Radio[] = [];

export const ensureRadioIds = (radios: Partial<Radio>[]): Radio[] =>
  radios.map((radio): Radio => ({
    id: radio.id ?? crypto.randomUUID(),
    status: radio.status ?? ("online" as Radio["status"]),
    configParams: radio.configParams ?? cloneConfigParams(),
  }));

export function clampValue(
  value: string,
  min?: number,
  max?: number,
): string {
  if (value === "") return "";

  const num = Number(value);

  if (Number.isNaN(num)) return value;
  if (min != null && num < min) return String(min);
  if (max != null && num > max) return String(max);

  return String(num);
}