import React from "react";

export default function AppShell({ sidebar, children }) {
  return (
    <div className="app-shell">
      {sidebar}
      <main className="content">{children}</main>
    </div>
  );
}
