"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Nome é obrigatório";
    if (!email.trim()) {
      errs.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Email inválido";
    }
    if (!password) {
      errs.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      errs.password = "Mínimo 6 caracteres";
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Confirme sua senha";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Senhas não conferem";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Simple hash for localStorage (not production-grade, just for demo)
    const pwHash = btoa(password);

    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      pw: pwHash,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("pks-user", JSON.stringify(user));
    localStorage.setItem("pks-logged-in", "true");
    setSubmitted(true);

    // Redirect to onboarding to collect empresa/cargo
    setTimeout(() => {
      router.push("/auth/onboarding");
    }, 1200);
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
        paddingTop: "60px",
        paddingBottom: "2rem",
        minHeight: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px", padding: "0 1rem" }}>
        {/* Brand */}
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
            Criar Conta
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Junte-se à Payments Academy gratuitamente
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
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</div>
              <p style={{ fontSize: "1.1rem", color: "var(--foreground)", fontWeight: 600, marginBottom: "0.5rem" }}>
                Conta criada com sucesso!
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Vamos conhecer você melhor...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Nome */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={labelStyle}>Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  style={inputStyle}
                />
                {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1.1rem" }}>
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

              {/* Senha */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={labelStyle}>Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
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
                      color: "var(--text-muted)",
                      padding: "0",
                    }}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && <p style={errorTextStyle}>{errors.password}</p>}
              </div>

              {/* Confirmar Senha */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Confirmar Senha</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  style={inputStyle}
                />
                {errors.confirmPassword && <p style={errorTextStyle}>{errors.confirmPassword}</p>}
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
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                }}
              >
                Criar Conta
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Já tem conta?{" "}
          <Link href="/auth/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
