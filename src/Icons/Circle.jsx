import React, { forwardRef } from "react";

function Circle(
  {
    width = 52,
    height = 52,
    circleRef,
    strokeWidth,
    radius = 5,
    color = "#fff",
    style
  },
  ref
) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 52 52"
      width={width}
      height={height}
      style={style}
      ref={ref}
    >
      <circle
        ref={circleRef}
        cx="26"
        cy="26"
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </svg>
  );
}

export default forwardRef(Circle);