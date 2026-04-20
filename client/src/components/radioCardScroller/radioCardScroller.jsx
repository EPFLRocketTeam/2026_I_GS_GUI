import { useEffect, useRef, useState } from "react";
import "./radioCardScroller.css";

function RadioCardScroller({ children, empty = false, itemWidth = 360, scrollRatio = 0.75, className = "" }) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  const scrollCards = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.max(itemWidth, Math.floor(el.clientWidth * scrollRatio));
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleWheel = (e) => {
    const el = scrollerRef.current;
    if (!el) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className={`hcs-shell ${empty ? "hcs-shell--empty" : ""} ${className}`}>
      <button
        className={`hcs-arrow hcs-arrow--left ${!canScrollLeft ? "is-hidden" : ""}`}
        onClick={() => scrollCards("left")}
        aria-label="Scroll left"
        type="button"
      >
        <svg className="hcs-arrow-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12.5 4.5L7 10l5.5 5.5" />
        </svg>
      </button>

      <div className="hcs-fade hcs-fade--left" />

      <div ref={scrollerRef} className="hcs-viewport" onWheel={handleWheel}>
        <div className="hcs-track">{children}</div>
      </div>

      <div className="hcs-fade hcs-fade--right" />

      <button
        className={`hcs-arrow hcs-arrow--right ${!canScrollRight ? "is-hidden" : ""}`}
        onClick={() => scrollCards("right")}
        aria-label="Scroll right"
        type="button"
      >
        <svg className="hcs-arrow-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M7.5 4.5L13 10l-5.5 5.5" />
        </svg>
      </button>
    </div>
  );
}

export default RadioCardScroller;