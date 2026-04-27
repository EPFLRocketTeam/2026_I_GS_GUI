import "./rocketDataPanel.css";

function RocketDataPanel({
  open,
  radio,
  onClose,
  profileOptions = [],
  onSwitchConfig,
  onConfigChange,
}) {
  return (
    <div
      className={`rdp-overlay ${open ? "open" : ""}`}
      onClick={onClose}
    >
      <aside
        className={`rdp-panel ${open ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rdp-header">
          <span>📡 Radio{" "}
            {radio?.configParams?.find((p) => p.key?.toLowerCase() === "uid")?.value ?? ""}
            {" "}— Properties</span>
          <button className="rdp-close" onClick={onClose}>✕</button>
        </div>

        {radio && (
          <div className="rdp-body">
            <div className="rdp-section">
              <div className="rdp-section-title">Configuration Profile</div>

              <select
                className="rdp-select"
                value={radio.configTemplate ?? "uplink"}
                onChange={(e) => onSwitchConfig?.(e.target.value)}
              >
                {profileOptions.map((profile) => (
                  <option key={profile.value} value={profile.value}>
                    {profile.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rdp-section">
              <div className="rdp-section-title">Config Parameters</div>

              {(radio.configParams ?? []).length === 0 ? (
                <p className="rdp-empty">No config parameters found.</p>
              ) : (
                <table className="rdp-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radio.configParams.map((param, pIdx) => (
                      <tr key={`${param.key}-${pIdx}`}>
                        <td>{param.label ?? param.key}</td>
                        <td><span className="rdp-type-pill">{param.type}</span></td>
                        <td>
                          {param.control === "select" ? (
                            <select
                              className="rdp-input"
                              value={param.value ?? ""}
                              onChange={(e) => onConfigChange?.(pIdx, e.target.value)}
                            >
                              {(param.options ?? []).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="rdp-input"
                              value={param.value ?? ""}
                              onChange={(e) => onConfigChange?.(pIdx, e.target.value)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default RocketDataPanel;