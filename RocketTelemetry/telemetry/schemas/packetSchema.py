import struct

# Each field: (name, format_char, unit)
# format chars follow Python's struct module:
#   'f' = float (4 bytes)
#   'h' = short int (2 bytes)
#   'i' = int (4 bytes)
#   'l' = long (4 bytes)
#   'H' = unsigned short
#   'I' = unsigned int
#   'B' = unsigned byte
#   '10s' = string of 10 bytes

PACKET_SCHEMA = {
    "0x01": {  # Radio ID → schema
        "fields": [ #name, format_char, unit]
            ("altitude",         "f",   "m"),
            ("velocity",         "f",   "m/s"),
            ("temperature",      "h",   "°C"),
            ("battery_voltage",  "f",   "V"),
            ("status_code",      "B",   ""),
        ]
    },
    "0x02": {
        "fields": [
            ("frequency",        "f",   "MHz"),
            ("baud_rate",        "I",   "bps"),
            ("tx_power",         "f",   "dBm"),
            ("channel",          "H",   ""),
        ]
    },
    "0x03": {
        "fields": [
            ("pressure",         "f",   "hPa"),
            ("humidity",         "H",   "%"),
            ("mission_name",     "10s", ""),
        ]
    }
}

def get_struct_format(schema_id):
    fields = PACKET_SCHEMA[schema_id]["fields"]
    fmt = "<" + "".join(f for _, f, _ in fields)  # little-endian
    return fmt, fields

def decode_packet(schema_id, raw_bytes):
    fmt, fields = get_struct_format(schema_id)
    values = struct.unpack(fmt, raw_bytes)
    result = {}
    for (name, fmt_char, unit), value in zip(fields, values):
        if fmt_char.endswith("s"):
            value = value.decode("utf-8").rstrip("\x00")  # clean string
        result[name] = {"value": value, "unit": unit}
    return result

def encode_packet(schema_id, data: dict):
    """For simulation: encode a dict into bytes."""
    fmt, fields = get_struct_format(schema_id)
    values = []
    for name, fmt_char, _ in fields:
        val = data[name]
        if fmt_char.endswith("s"):
            size = int(fmt_char[:-1])
            val = val.encode("utf-8").ljust(size, b"\x00")
        values.append(val)
    return struct.pack("<" + "".join(f for _, f, _ in fields), *values)