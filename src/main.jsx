import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Erro inesperado." };
  }

  componentDidCatch(error, info) {
    console.error("GLINK PROCESS RUNTIME ERROR:", error, info);
  }

  handleReset = () => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("glink_"))
        .forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.error("Falha ao limpar armazenamento local", e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="login-screen">
          <div className="login-card">
            <div className="login-brand">
              <div className="brand-mark">G</div>
              <div>
                <strong>Glink Process</strong>
                <span>Modo de recuperação</span>
              </div>
            </div>
            <h1>Falha ao carregar a aplicação</h1>
            <p>
              Foi detectado um erro de execução, normalmente ligado a dados locais
              corrompidos ou incompatíveis com a versão atual.
            </p>
            <div className="login-error">{this.state.message}</div>
            <button className="btn primary full-btn" onClick={this.handleReset}>
              Limpar dados locais e recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
