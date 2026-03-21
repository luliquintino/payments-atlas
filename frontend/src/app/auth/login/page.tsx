"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

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
    if (!validate()) return;

    // Check if user exists in localStorage
    const stored = localStorage.getItem("pks-user");
    if (!stored) {
      setErrors({ general: "Email nao encontrado. Cadastre-se primeiro." });
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (user.email !== email.trim().toLowerCase()) {
        setErrors({ general: "Email nao encontrado. Cadastre-se primeiro." });
        return;
      }

      // Login success
      localStorage.setItem("pks-logged-in", "true");
      router.push("/");
    } catch {
      setErrors({ general: "Erro ao verificar conta. Tente novamente." });
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
    boxSizing: "border-box",
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
          <form onSubmit={handleSubmit}>
            {/* General error */}
            {errors.general && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--error, #EF4444)",
                    fontWeight: 500,
                  }}
                >
                  {errors.general}
                </p>
              </div>
            )}

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
                  placeholder="Sua senha"
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
                    padding: "0",
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
          </form>
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
            href="/auth/register"
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
