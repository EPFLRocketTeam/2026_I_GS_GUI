function TelemetrySummaryCards({ latest }) {
  if (!latest) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Altitude</h3>
        <p>{latest.altitude?.toFixed(2)} m</p>
      </div>

      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Velocity</h3>
        <p>{latest.velocity?.toFixed(2)} m/s</p>
      </div>

      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Temperature</h3>
        <p>{latest.temperature?.toFixed(2)} °C</p>
      </div>

      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Battery</h3>
        <p>{latest.battery_voltage?.toFixed(2)} V</p>
      </div>
    </div>
  );
}

export default TelemetrySummaryCards;