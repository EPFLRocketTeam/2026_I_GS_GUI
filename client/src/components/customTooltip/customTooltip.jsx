function CustomTooltip({ active, payload, label, title, dataKey }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;

  return (
    <div
      style={{
        backgroundColor: "#111",
        border: "1px solid #666",
        borderRadius: "8px",
        padding: "10px 12px",
        color: "white",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>{title}</p>
      <p style={{ margin: "6px 0 0 0" }}>
        <strong>Time:</strong> {label}
      </p>
      <p style={{ margin: "4px 0 0 0" }}>
        <strong>{dataKey}:</strong> {point[dataKey]}
      </p>
    </div>
  );
}

export default CustomTooltip
