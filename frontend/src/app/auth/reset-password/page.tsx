"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isLongEnough = password.length >= 6;
  const passwordsMatch = password === confirm && confirm.length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLongEnough) {
      setError("Senha precisa ter no minimo 6 caracteres");
      return;
    }
    if (!passwordsMatch) {
      setError("Senhas nao coincidem");
      return;
    }
    setError("");
    setSuccess(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.85rem",
    fontSize: "0.95rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--surface-hover)",
    color: "var(--foreground)",
    outline: "none",
    transition: "border-color 0.2s",
    paddingRight: "2.75rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--foreground)",
    marginBottom: "0.4rem",
  };

  const toggleBtnStyle: React.CSSProperties = {
    position: "absolute",
    right: "0.65rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.1rem",
    lineHeight: 1,
    color: "var(--text-muted)",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        paddingTop: "80px",
        paddingBottom: "2rem",
        minHeight: "100vh",
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "0 1rem",
          margin: "0 auto",
        }}
      >
        {/* Brand icon */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "var(--gradient-primary)",
              color: "#fff",
              fontSize: "1.25rem",
              fontWeight: 800,
              marginBottom: "1rem",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            PA
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Nova Senha
          </h1>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          {success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✅</div>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Senha alterada com sucesso!
              </p>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  marginBottom: "1.25rem",
                }}
              >
                Agora voce pode fazer login com sua nova senha.
              </p>
              <Link
                href="/auth/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "10px",
                  background: "var(--gradient-primary)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Ir para login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* New password */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Nova Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={toggleBtnStyle}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {/* Requirement indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.5rem",
                    fontSize: "0.8rem",
                    color: isLongEnough ? "var(--success, #10B981)" : "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  <span>{isLongEnough ? "✓" : "○"}</span>
                  Minimo 6 caracteres
                </div>
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Confirmar Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={toggleBtnStyle}
                    aria-label={showConfirm ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
                {confirm.length > 0 && !passwordsMatch && (
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--error, #EF4444)",
                      marginTop: "0.3rem",
                    }}
                  >
                    Senhas nao coincidem
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--error, #EF4444)",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--gradient-primary)",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                }}
              >
                Alterar Senha
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        {!success && (
          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              href="/auth/login"
              style={{
                fontSize: "0.9rem",
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ← Voltar ao login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
