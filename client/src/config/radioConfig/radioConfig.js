export const DEFAULT_RADIOS = [
  {
    uid: 1,
    status: "online",
    idVal: "0x01",
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "10" },
    ],
  },
  {
    uid: 2,
    status: "syncing",
    idVal: "0x01",
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
      { key: "baudRate",  label: "Baud rate", unit: "bps", value: "19200" },
      { key: "txPower",   label: "TX power",  unit: "dBm", value: "5" },
      { key: "channel",   label: "Channel",   unit: "",    value: "3" },  // ← this radio has an extra pin
    ],
  },
  {
    uid: 3,
    status: "offline",
    idVal: "0x03",
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "868" },
    ],
  },
];

export const NEW_RADIO_TEMPLATE = (uid) => ({
  uid,
  status: "offline",
  idVal: `0x0${uid}`,
  pins: [
    { key: "frequency", label: "Frequency", unit: "MHz", value: "433" },
    { key: "baudRate",  label: "Baud rate", unit: "bps", value: "9600" },
  ],
});