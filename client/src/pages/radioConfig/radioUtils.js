export const downloadConfig = (radios) => {
  const config = radios.map(({ errors, saved, ...radio }) => radio);
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `radio-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const loadConfig = (onSuccess) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        const loaded = parsed.map(radio => ({
          ...radio,
          saved: false,
          pins: Array.isArray(radio.pins) ? radio.pins : [],
        }));
        onSuccess(loaded);
      } catch {
        alert("Invalid config file — must be a JSON array of radio objects.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

export const validate = (radios) => {
  const ids = radios.map(r => r.idVal);
  return radios.map(r => ({
    ...r,
    errors: ids.filter(id => id === r.idVal).length > 1 ? ["Same ID used twice"] : [],
  }));
};

export const createNewRadio = (nextId) => ({
  uid: nextId,
  idVal: `0x0${nextId.toString(16).toUpperCase()}`,
  status: "offline",
  saved: false,
  pins: [
    { key: "frequency", label: "Frequency", unit: "MHz", value: "433", type: "FLOAT" },
    { key: "baudRate", label: "Baud Rate", unit: "bps", value: "9600", type: "UNSIGNED_INT" },
  ],
});

export const DEFAULT_RADIOS = validate([
  {
    uid: 1,
    idVal: "0x01",
    status: "waiting",
    pins: [
      { key: "altitude", label: "Altitude", unit: "m", value: "0.0", type: "FLOAT" },
      { key: "velocity", label: "Velocity", unit: "m/s", value: "0.0", type: "FLOAT" },
      { key: "temperature", label: "Temperature", unit: "°C", value: "0", type: "SHORT" },
      { key: "battery_voltage", label: "Battery Voltage", unit: "V", value: "0.0", type: "FLOAT" },
      { key: "status_code", label: "Status Code", unit: "", value: "0", type: "BYTE" },
    ],
  },
  {
    uid: 2,
    idVal: "0x02",
    status: "waiting",
    pins: [
      { key: "frequency", label: "Frequency", unit: "MHz", value: "0.0", type: "FLOAT" },
      { key: "baud_rate", label: "Baud Rate", unit: "bps", value: "0", type: "UNSIGNED_INT" },
      { key: "tx_power", label: "TX Power", unit: "dBm", value: "0.0", type: "FLOAT" },
      { key: "channel", label: "Channel", unit: "", value: "0", type: "UNSIGNED_SHORT" },
    ],
  },
  {
    uid: 3,
    idVal: "0x03",
    status: "waiting",
    pins: [
      { key: "pressure", label: "Pressure", unit: "hPa", value: "0.0", type: "FLOAT" },
      { key: "humidity", label: "Humidity", unit: "%", value: "0", type: "UNSIGNED_SHORT" },
      { key: "mission_name", label: "Mission Name", unit: "", value: "", type: "STRING(10)" },
    ],
  },
]);


export const handleAdd = (nextId) => {
    return nextId++;
  };