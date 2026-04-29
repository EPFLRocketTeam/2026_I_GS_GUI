import { useLayoutEffect, useRef, useState } from "react";
import "./digitalDisplayCard.css";

const MAX_FONT_SIZE = 32;
const MIN_FONT_SIZE = 12;
const BOX_PADDING = 12;

function DigitalDisplayCard({ display, value, onContextMenu }) {
  const hasVariable = Boolean(display?.variable);
  const displayValue = hasVariable ? value ?? "--" : "--";

  const bodyRef = useRef(null);
  const valueRef = useRef(null);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);

  useLayoutEffect(() => {
    const fitText = () => {
      const bodyEl = bodyRef.current;
      const valueEl = valueRef.current;
      if (!bodyEl || !valueEl) return;

      const maxWidth = bodyEl.clientWidth - BOX_PADDING * 2;
      const maxHeight = bodyEl.clientHeight - BOX_PADDING * 2;

      let nextSize = MAX_FONT_SIZE;
      valueEl.style.fontSize = `${nextSize}px`;

      while (
        nextSize > MIN_FONT_SIZE &&
        (valueEl.scrollWidth > maxWidth || valueEl.scrollHeight > maxHeight)
      ) {
        nextSize -= 1;
        valueEl.style.fontSize = `${nextSize}px`;
      }

      while (nextSize < MAX_FONT_SIZE) {
        valueEl.style.fontSize = `${nextSize + 1}px`;

        if (valueEl.scrollWidth > maxWidth || valueEl.scrollHeight > maxHeight) {
          break;
        }

        nextSize += 1;
      }

      setFontSize(nextSize);
    };

    fitText();
    window.addEventListener("resize", fitText);
    return () => window.removeEventListener("resize", fitText);
  }, [displayValue, display?.suffix, display?.variable]);

  return (
    <div className={`digital-display-card ${!hasVariable ? "is-empty" : ""}`} onContextMenu={onContextMenu}>
      <div className="digital-display-card-header">
        <div className="digital-display-title">
          {display.title || "Untitled display"}
        </div>
      </div>

      <div className="digital-display-card-body" ref={bodyRef}>
        <div
          ref={valueRef}
          className="digital-display-value"
          style={{ fontSize: `${fontSize}px` }}
        >
          {displayValue}
          {hasVariable && display.suffix ? <span className="digital-display-suffix">{display.suffix}</span> : null}
        </div>
      </div>

      <div className="digital-display-card-footer">
        R{display.radioUid ?? "?"} · {display.variable || "No variable selected"}
      </div>
    </div>
  );
}

export default DigitalDisplayCard;