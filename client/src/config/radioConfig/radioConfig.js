export const DEFAULT_RADIOS = [
  {
    status: "online",
    pins: [
      { key: "uid", label: "uid", unit: "", value: "1" },
      { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "10" },
    ],
  },
  {
    status: "syncing",
    pins: [
      { key: "uid", label: "uid", unit: "", value: "2" },
      { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "19200" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "5" },
      { key: "channel",   label: "Channel",   unit: "",    value: "3" },  // ← this radio has an extra pin
    ],
  },
  {
    status: "offline",
    pins: [
      { key: "uid", label: "uid", unit: "", value: "3" },
      { key: "frequency", label: "Frequency", unit: "MHz", value: "868" },
    ],
  },
];

export const NEW_RADIO_TEMPLATE = (uid) => ({
  status: "offline",
  pins: [
    { key: "uid", label: "uid", unit: "", value: uid },
    { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
    { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
  ],
});