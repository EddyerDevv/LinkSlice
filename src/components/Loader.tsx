"use client";
import { useRef, useEffect, memo } from "react";
import "@/styles/Loader.css";

interface LoaderProps {
  size?: number | string;
  value?: number;
  color?: string;
  className?: string;
  strokeWidth?: number | string;
}

function Loader({
  size = 36,
  color = "#fff",
  value = undefined,
  className = "",
  strokeWidth = "1.75",
  ...restProps
}: LoaderProps) {
  const elementRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current && value !== undefined && !isNaN(value)) {
      const circle = circleRef.current;
      const circleRadius = circle.r.baseVal.value;
      const circleCircumference = Math.PI * (circleRadius * 2);
      const currentValue = Math.min(Math.max(value, 0), 100);
      circle.style.strokeDashoffset = `${
        ((100 - currentValue) / 100) * circleCircumference
      }`;
    }
  }, [value]);

  return (
    <svg
      id="app_loader"
      ref={elementRef}
      role={value !== undefined ? "progressbar" : "status"}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      tabIndex={-1}
      className={`${className} ${value === undefined ? "indeterminate" : ""}`}
      aria-valuemin={value !== undefined ? 0 : undefined}
      aria-valuemax={value !== undefined ? 100 : undefined}
      aria-valuenow={value}
      {...restProps}
    >
      <circle
        r="7"
        cx="50%"
        cy="50%"
        ref={circleRef}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="3"
      />
    </svg>
  );
}

export default memo(Loader);
