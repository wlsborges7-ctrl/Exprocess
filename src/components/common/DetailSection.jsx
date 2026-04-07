import React from "react";

export default function DetailSection({ title, subtitle, children, action }) {
  return (
    <div className="detail-section">
      <div className="detail-section-header">
        <div>
          <h4>{title}</h4>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action || null}
      </div>
      {children}
    </div>
  );
}
