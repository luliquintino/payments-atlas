"use client";

import { useState, useEffect } from "react";

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (localStorage.getItem("pks-install-dismissed")) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setTimeout(() => setShow(true), 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pks-install-dismissed", "true");
  };

  if (!show) return null;

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/.test(navigator.userAgent);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: "var(--primary)",
        color: "#fff",
        padding: "10px 16px",
        paddingTop: "calc(10px + env(safe-area-inset-top))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        fontSize: "0.8125rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ flex: 1 }}>
        {isIOS
          ? 'Toque em \u2B06\uFE0F e "Adicionar \u00E0 Tela de In\u00EDcio" para instalar'
          : "Instale o app para melhor experi\u00EAncia"}
      </span>
      {!isIOS && (
        <button
          onClick={handleInstall}
          style={{
            padding: "5px 14px",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Instalar
        </button>
      )}
      <button
        onClick={handleDismiss}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          fontSize: "1.125rem",
          cursor: "pointer",
          padding: "0",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {"\u2715"}
      </button>
    </div>
  );
}
