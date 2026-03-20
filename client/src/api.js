export async function fetchTelemetry() {
  const response = await fetch("http://127.0.0.1:8001/api/telemetry/");

  if (!response.ok) {
    throw new Error("Failed to fetch telemetry");
  }

  return response.json();
}