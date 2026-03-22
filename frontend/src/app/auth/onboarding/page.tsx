"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  "Analista",
  "Coordenador(a)",
  "Gerente",
  "Diretor(a)",
  "C-Level",
  "Desenvolvedor(a)",
  "Produto",
  "Estudante",
  "Outro",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("pks-user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setUserName(user.name || "");
        // If already has company/role, redirect to home
        if (user.company && user.role) {
          router.push("/");
        }
      } catch {
        router.push("/auth/register");
      }
    } else {
      router.push("/auth/register");
    }
  }, [router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: { company?: string; role?: string } = {};
    if (!company.trim()) errs.company = "Informe sua empresa ou organização";
    if (!role) errs.role = "Selecione seu cargo";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Update user profile with company and role
    const raw = localStorage.getItem("pks-user");
    if (raw) {
      const user = JSON.parse(raw);
      user.company = company.trim();
      user.role = role;
      localStorage.setItem("pks-user", JSON.stringify(user));
    }

    setSubmitted(true);
    setTimeout(() => router.push("/"), 1500);
  }

  function handleSkip() {
    router.push("/");
  }

  const firstName = userName.split(" ")[0] || "você";

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
        paddingBottom: "2rem",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px", padding: "0 1rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👋</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Bem-vindo, {firstName}!
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Conte-nos um pouco mais sobre você para personalizar sua experiência.
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
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🚀</div>
              <p style={{ fontSize: "1.1rem", color: "var(--foreground)", fontWeight: 600, marginBottom: "0.5rem" }}>
                Tudo pronto!
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Preparando sua jornada de aprendizado...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Empresa */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Empresa / Organização</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Nubank, Stone, Itaú..."
                  style={inputStyle}
                />
                {errors.company && (
                  <p style={{ fontSize: "0.78rem", color: "var(--error, #EF4444)", marginTop: "0.3rem" }}>
                    {errors.company}
                  </p>
                )}
              </div>

              {/* Cargo */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Cargo</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.85rem center",
                    paddingRight: "2.5rem",
                    appearance: "none" as React.CSSProperties["appearance"],
                  }}
                >
                  <option value="">Selecione seu cargo</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.role && (
                  <p style={{ fontSize: "0.78rem", color: "var(--error, #EF4444)", marginTop: "0.3rem" }}>
                    {errors.role}
                  </p>
                )}
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
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                  marginBottom: "0.75rem",
                }}
              >
                Começar a Aprender
              </button>

              {/* Skip */}
              <button
                type="button"
                onClick={handleSkip}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Pular por agora
              </button>
            </form>
          )}
        </div>

        {/* Why we ask */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem 1.25rem",
            borderRadius: "12px",
            background: "var(--surface-hover)",
            border: "1px solid var(--border)",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            💡 Essas informações nos ajudam a personalizar o conteúdo e entender melhor nossa comunidade. Você pode alterar a qualquer momento no seu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
