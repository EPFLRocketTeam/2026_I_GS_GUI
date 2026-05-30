import { useEffect, useRef, useState, type WheelEvent } from "react";
import "./radioCardScroller.css";
import { RadioCardScrollerProps, ScrollDirection } from "../../types/types";
import { SCROLL_EDGE_TOLERANCE } from "../../constants/radioCardConstants";

function RadioCardScroller({
  children,
  empty = false,
  itemWidth = 360,
  scrollRatio = 0.75,
  className = "",
}:
Readonly<RadioCardScrollerProps>) 
{
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > SCROLL_EDGE_TOLERANCE); 
      setCanScrollRight(el.scrollLeft < maxScrollLeft - SCROLL_EDGE_TOLERANCE);
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  const scrollCards = (direction: ScrollDirection) => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.max(
      itemWidth,
      Math.floor(el.clientWidth * scrollRatio),
    );
    el.scrollBy({
      left: direction === ScrollDirection.left ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleWheel = (e: WheelEvent) => {
    const el = scrollerRef.current;
    if (!el) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  const shellClassName = empty
    ? `hcs-shell hcs-shell--empty ${className}`
    : `hcs-shell ${className}`;

  const leftArrowClassName = canScrollLeft
    ? "hcs-arrow hcs-arrow--left"
    : "hcs-arrow hcs-arrow--left is-hidden";

  const rightArrowClassName = canScrollRight
    ? "hcs-arrow hcs-arrow--right"
    : "hcs-arrow hcs-arrow--right is-hidden";

  return (
    <div
      className={shellClassName}
    >
      <button
        className={leftArrowClassName}
        onClick={() => scrollCards(ScrollDirection.left)}
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
        className={rightArrowClassName}
        onClick={() => scrollCards(ScrollDirection.right)}
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
