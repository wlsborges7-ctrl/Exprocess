import React from "react";

export default function MiniDonut({ value, total, label }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dash = (circumference * percent) / 100;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 64 64" className="donut">
        <circle cx="32" cy="32" r={radius} className="donut-bg"></circle>
        <circle cx="32" cy="32" r={radius} className="donut-fg" strokeDasharray={`${dash} ${circumference - dash}`}></circle>
      </svg>
      <div className="donut-text">
        <strong>{value}/{total}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
