import { useLayoutEffect, useRef, useState } from "react";
import "./digitalDisplayCard.css";
import { DigitalDisplayCardProps } from "../../types/types";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, BOX_PADDING } from "../../constants/digitalDisplayCardConstants";

function DigitalDisplayCard({ display, value, onContextMenu }: 
 Readonly<DigitalDisplayCardProps>
) {
  const hasVariable = Boolean(display?.varName);
  const displayValue = hasVariable ? (value ?? "--") : "--";

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);

  useLayoutEffect(() => {
    const bodyEl = bodyRef.current;
    const valueEl = valueRef.current;

    if (!bodyEl || !valueEl) return;

    const fitText = () => {
      const maxWidth = bodyEl.clientWidth - BOX_PADDING * 2;
      const maxHeight = bodyEl.clientHeight - BOX_PADDING * 2;

      let nextSize = MAX_FONT_SIZE;

      valueEl.style.fontSize = `${nextSize}px`;

      while (
        nextSize > MIN_FONT_SIZE &&
        (valueEl.scrollWidth > maxWidth ||
          valueEl.scrollHeight > maxHeight)
      ) {
        nextSize -= 1;
        valueEl.style.fontSize = `${nextSize}px`;
      }

      while (nextSize < MAX_FONT_SIZE) {
        valueEl.style.fontSize = `${nextSize + 1}px`;

        if (
          valueEl.scrollWidth > maxWidth ||
          valueEl.scrollHeight > maxHeight
        ) {
          break;
        }

        nextSize += 1;
      }

      setFontSize(nextSize);
    };

    fitText();

    const resizeObserver = new ResizeObserver(() => {
      fitText();
    });

    resizeObserver.observe(bodyEl);

    window.addEventListener("resize", fitText);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitText);
    };
  }, [displayValue, display?.varValue]);

  return (
    <div
      className={`digital-display-card ${hasVariable ? "" : "is-empty"}`}
      >
    <button
      onContextMenu={onContextMenu}
    />
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
        </div>
      </div>

      <div className="digital-display-card-footer">
        R{display.radioId ?? "?"} ·{" "}
        {display.varName || "No variable selected"}
      </div>
    </div>
  );
}

export default DigitalDisplayCard;
