"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Email e obrigatorio");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email invalido");
      return;
    }
    setError("");
    setSent(true);
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
              marginBottom: "0.25rem",
            }}
          >
            Recuperar Senha
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Digite seu email para receber um link de recuperacao
          </p>
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
          {sent ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📧</div>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Email enviado!
              </p>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                  marginBottom: "1.25rem",
                }}
              >
                Se o email existir, enviaremos um link de recuperacao.
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
                Voltar ao login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={inputStyle}
                />
                {error && (
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--error, #EF4444)",
                      marginTop: "0.3rem",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>

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
                Enviar Link
              </button>
            </form>
          )}
        </div>

        {/* Back to login */}
        {!sent && (
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
