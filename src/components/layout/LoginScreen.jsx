import React from "react";

export default function LoginScreen({
  branding,
  loginForm,
  setLoginForm,
  showLoginPassword,
  setShowLoginPassword,
  loginError,
  handleLogin,
}) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand brand-with-logo">
          <img src={branding.logoPath} alt={branding.appName} className="brand-logo login-logo" />
          <div>
            <strong>{branding.appName}</strong>
            <span>{branding.loginSubtitle}</span>
          </div>
        </div>
        <h1>Entrar no sistema</h1>
        <p>{branding.internalAccessText}</p>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            placeholder="Usuário"
            value={loginForm.usuario}
            onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })}
          />
          <div className="password-wrap">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Senha"
              value={loginForm.senha}
              onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
            />
            <button type="button" className="eye-btn" onClick={() => setShowLoginPassword((v) => !v)}>
              {showLoginPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {loginError ? <div className="login-error">{loginError}</div> : null}
          <button className="btn primary full-btn" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
