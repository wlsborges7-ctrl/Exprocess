import React from "react";

export default function AppSidebar({
  branding,
  visibleMenu,
  activePage,
  setActivePage,
  currentUser,
  resetDemoData,
  handleLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="brand brand-with-logo">
        <img src={branding.logoPath} alt={branding.appName} className="brand-logo sidebar-logo" />
        <div>
          <strong>{branding.appName}</strong>
          <span>{branding.sidebarSubtitle}</span>
        </div>
      </div>

      <nav className="menu">
        {visibleMenu.map((item) => (
          <button
            key={item}
            className={`menu-item ${activePage === item ? "active" : ""}`}
            onClick={() => setActivePage(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-box">
        <h3>Usuário logado</h3>
        <p><strong>{currentUser?.nome}</strong><br />{currentUser?.perfil}</p>
      </div>

      {currentUser?.perfil === "Administrador" ? (
        <button className="btn secondary full-btn" onClick={resetDemoData}>Resetar demonstração</button>
      ) : null}
      <button className="btn ghost full-btn" onClick={handleLogout}>Sair</button>
    </aside>
  );
}
