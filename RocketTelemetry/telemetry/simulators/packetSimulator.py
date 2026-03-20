# telemetry/simulator.py
import random
import struct
from telemetry.schemas.packetSchema import encode_packet, PACKET_SCHEMA

def generate_fake_packet(schema_id: str) -> bytes:
    """Generate a random valid packet for a given radio ID."""
    
    fake_data = {
        "0x01": {
            "altitude":        random.uniform(0, 3000),
            "velocity":        random.uniform(0, 400),
            "temperature":     random.randint(-30, 80),
            "battery_voltage": random.uniform(11.0, 14.0),
            "status_code":     random.randint(0, 255),
        },
        "0x02": {
            "frequency":       random.uniform(400, 500),
            "baud_rate":       random.choice([9600, 19200, 38400, 57600, 115200]),
            "tx_power":        random.uniform(0, 20),
            "channel":         random.randint(0, 255),
        },
        "0x03": {
            "pressure":      random.uniform(900, 1100),
            "humidity":      random.randint(0, 100),
            "mission_name":  "ROCKET-1",
        }
    }

    return encode_packet(schema_id, fake_data[schema_id])


def packet_to_hex(raw_bytes: bytes) -> str:
    return raw_bytes.hex()


# Run standalone to preview output
if __name__ == "__main__":
    for radio_id in PACKET_SCHEMA:
        raw = generate_fake_packet(radio_id)
        print(f"\nRadio {radio_id}")
        print(f"  Raw bytes : {raw}")
        print(f"  Hex string: {packet_to_hex(raw)}")
        print(f"  Length    : {len(raw)} bytes")