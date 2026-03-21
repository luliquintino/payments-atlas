"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const errs: { email?: string; password?: string } = {};
    if (!email) {
      errs.email = "Email e obrigatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Email invalido";
    }
    if (!password) {
      errs.password = "Senha e obrigatoria";
    } else if (password.length < 6) {
      errs.password = "Minimo 6 caracteres";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--foreground)",
    marginBottom: "0.4rem",
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    color: "var(--error, #EF4444)",
    marginTop: "0.3rem",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
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
            Entrar
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Acesse sua conta na Payments Academy
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
          {submitted ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔧</div>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Sistema de autenticacao em construcao
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Em breve voce podera fazer login.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: "1.25rem",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-hover)",
                  color: "var(--foreground)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Voltar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={inputStyle}
                />
                {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={labelStyle}>Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
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
                    }}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && <p style={errorTextStyle}>{errors.password}</p>}
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
                <Link
                  href="/auth/forgot-password"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Esqueci minha senha
                </Link>
              </div>

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
                Entrar
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  margin: "1.5rem 0",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  ou
                </span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>

              {/* Social buttons */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {["Google", "GitHub"].map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    style={{
                      flex: 1,
                      padding: "0.65rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--surface-hover)",
                      color: "var(--foreground)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </form>
          )}
        </div>

        {/* Sign up link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Nao tem conta?{" "}
          <Link
            href="#"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
