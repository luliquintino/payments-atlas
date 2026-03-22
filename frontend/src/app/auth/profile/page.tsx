"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
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

interface UserProfile {
  name: string;
  email: string;
  company?: string;
  role?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("pks-user");
    if (!raw) {
      router.push("/auth/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setCompany(parsed.company || "");
      setRole(parsed.role || "");
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const updated = { ...user, company: company.trim(), role };
    localStorage.setItem("pks-user", JSON.stringify(updated));
    setUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    localStorage.removeItem("pks-logged-in");
    localStorage.removeItem("pks-user");
    router.push("/landing");
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "—";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.85rem",
    fontSize: "0.95rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--surface-hover)",
    color: "var(--foreground)",
    outline: "none",
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
    <div style={{ maxWidth: "32rem", margin: "0 auto", paddingBottom: "4rem" }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: "2rem" }}>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>Meu Perfil</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Avatar + Info */}
      <div
        className="card animate-fade-in stagger-1"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "1.25rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            {user.name}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
            {user.email}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
            Membro desde {memberSince}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1.25rem" }}>
          Informações Profissionais
        </h2>

        <form onSubmit={handleSave}>
          {/* Empresa */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={labelStyle}>Empresa / Organização</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Nubank, Stone, Itaú..."
              style={inputStyle}
            />
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
                appearance: "none" as React.CSSProperties["appearance"],
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.85rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">Selecione seu cargo</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.65rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                background: "var(--gradient-primary)",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
              }}
            >
              Salvar
            </button>
            {saved && (
              <span style={{ fontSize: "0.85rem", color: "var(--success)", fontWeight: 500 }}>
                ✓ Salvo com sucesso
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Account Section */}
      <div className="card animate-fade-in stagger-3" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem" }}>
          Conta
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href="/auth/reset-password"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--surface-hover)",
              textDecoration: "none",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <span>🔒</span>
            <span>Alterar Senha</span>
          </Link>

          <Link
            href="/progress"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--surface-hover)",
              textDecoration: "none",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <span>📊</span>
            <span>Meu Progresso</span>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="animate-fade-in stagger-4">
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "1px solid var(--error, #EF4444)",
            background: "transparent",
            color: "var(--error, #EF4444)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
