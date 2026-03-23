"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlowStep {
  from: string;
  to: string;
  label: string;
  detail: string;
  type?: "request" | "response" | "async";
}

export interface FlowDiagramProps {
  title: string;
  actors: string[];
  steps: FlowStep[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACTOR_BOX_W = 120;
const ACTOR_BOX_H = 40;
const ACTOR_GAP = 160;
const LEFT_PAD = 30;
const TOP_PAD = 20;
const STEP_HEIGHT = 52;
const LIFELINE_START = TOP_PAD + ACTOR_BOX_H + 10;
const ARROW_COLORS: Record<string, string> = {
  request: "#818CF8",
  response: "#34D399",
  async: "#FBBF24",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FlowDiagram({ title, actors, steps }: FlowDiagramProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [highlightedStep, setHighlightedStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Actor x-center positions
  const actorX = (idx: number) => LEFT_PAD + ACTOR_BOX_W / 2 + idx * ACTOR_GAP;

  const svgWidth = LEFT_PAD * 2 + ACTOR_BOX_W + (actors.length - 1) * ACTOR_GAP;
  const svgHeight = LIFELINE_START + steps.length * STEP_HEIGHT + 40;

  // Auto-play logic
  const stopPlay = useCallback(() => {
    setIsPlaying(false);
    setHighlightedStep(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const startPlay = useCallback(() => {
    setIsPlaying(true);
    setSelectedStep(null);
    setHighlightedStep(0);
  }, []);

  useEffect(() => {
    if (!isPlaying || highlightedStep === null) return;
    timerRef.current = setTimeout(() => {
      if (highlightedStep < steps.length - 1) {
        setHighlightedStep(highlightedStep + 1);
      } else {
        stopPlay();
      }
    }, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, highlightedStep, steps.length, stopPlay]);

  const handleStepClick = (idx: number) => {
    if (isPlaying) stopPlay();
    setSelectedStep(selectedStep === idx ? null : idx);
  };

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderArrow = (step: FlowStep, idx: number) => {
    const fromIdx = actors.indexOf(step.from);
    const toIdx = actors.indexOf(step.to);
    if (fromIdx === -1 || toIdx === -1) return null;

    const y = LIFELINE_START + idx * STEP_HEIGHT + 24;
    const x1 = actorX(fromIdx);
    const x2 = actorX(toIdx);
    const direction = x2 > x1 ? 1 : -1;
    const arrowTip = x2 - direction * 8;
    const color = ARROW_COLORS[step.type || "request"];
    const isAsync = step.type === "async";
    const isActive = highlightedStep === idx;
    const isSelected = selectedStep === idx;
    const opacity = highlightedStep !== null && !isActive ? 0.3 : 1;

    return (
      <g
        key={idx}
        onClick={() => handleStepClick(idx)}
        style={{ cursor: "pointer", opacity, transition: "opacity 0.3s" }}
        filter={isActive ? "url(#glow)" : undefined}
      >
        {/* Clickable hit area */}
        <rect
          x={Math.min(x1, x2) - 10}
          y={y - 18}
          width={Math.abs(x2 - x1) + 20}
          height={36}
          fill="transparent"
        />

        {/* Step number circle */}
        <circle
          cx={Math.min(x1, x2) - 18}
          cy={y}
          r={12}
          fill={isActive || isSelected ? color : "var(--primary)"}
          stroke={isActive || isSelected ? color : "var(--primary)"}
          strokeWidth={1.5}
        />
        <text
          x={Math.min(x1, x2) - 18}
          y={y + 4}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill="white"
        >
          {idx + 1}
        </text>

        {/* Arrow line */}
        <line
          x1={x1}
          y1={y}
          x2={arrowTip}
          y2={y}
          stroke={color}
          strokeWidth={isActive || isSelected ? 2.5 : 1.5}
          strokeDasharray={isAsync ? "6,4" : undefined}
          markerEnd={`url(#arrow-${step.type || "request"})`}
        />

        {/* Label background */}
        <rect
          x={(x1 + x2) / 2 - step.label.length * 3.2 - 8}
          y={y - 20}
          width={step.label.length * 6.4 + 16}
          height={18}
          rx={4}
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth={1}
        />
        {/* Label */}
        <text
          x={(x1 + x2) / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          fill={isActive || isSelected ? color : "var(--foreground)"}
        >
          {step.label}
        </text>
      </g>
    );
  };

  return (
    <div
      ref={containerRef}
      className="card-glow animate-fade-in"
      style={{ marginBottom: "1.5rem" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem 0.75rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          {title}
        </h3>
        <button
          onClick={isPlaying ? stopPlay : startPlay}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.875rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: isPlaying ? "var(--primary)" : "var(--surface)",
            color: isPlaying ? "white" : "var(--foreground)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isPlaying ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Pausar
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Auto-play
            </>
          )}
        </button>
      </div>

      {/* SVG Container - scrollable on mobile */}
      <div
        style={{
          overflowX: "auto",
          padding: "0 0.5rem 1rem",
        }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ minWidth: svgWidth, display: "block" }}
        >
          {/* Defs: arrow markers + glow filter */}
          <defs>
            {(["request", "response", "async"] as const).map((type) => (
              <marker
                key={type}
                id={`arrow-${type}`}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0,0 L8,4 L0,8 Z"
                  fill={ARROW_COLORS[type]}
                />
              </marker>
            ))}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Actor boxes */}
          {actors.map((actor, i) => {
            const cx = actorX(i);
            return (
              <g key={actor}>
                {/* Box */}
                <rect
                  x={cx - ACTOR_BOX_W / 2}
                  y={TOP_PAD}
                  width={ACTOR_BOX_W}
                  height={ACTOR_BOX_H}
                  rx={8}
                  fill="var(--primary-bg)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                />
                <text
                  x={cx}
                  y={TOP_PAD + ACTOR_BOX_H / 2 + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="var(--foreground)"
                >
                  {actor}
                </text>

                {/* Lifeline */}
                <line
                  x1={cx}
                  y1={LIFELINE_START}
                  x2={cx}
                  y2={svgHeight - 10}
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  opacity={0.7}
                />
              </g>
            );
          })}

          {/* Steps / arrows */}
          {steps.map((step, idx) => renderArrow(step, idx))}
        </svg>
      </div>

      {/* Detail tooltip when a step is selected */}
      {selectedStep !== null && (
        <div
          style={{
            margin: "0 1rem 1rem",
            padding: "0.875rem 1rem",
            borderRadius: "0.75rem",
            background: "var(--surface-hover)",
            border: "1px solid var(--border)",
            fontSize: "0.8125rem",
            lineHeight: 1.5,
            color: "var(--foreground)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.375rem",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.375rem",
                height: "1.375rem",
                borderRadius: "50%",
                background: ARROW_COLORS[steps[selectedStep].type || "request"],
                color: "white",
                fontSize: "0.6875rem",
                fontWeight: 700,
              }}
            >
              {selectedStep + 1}
            </span>
            <strong>
              {steps[selectedStep].from} → {steps[selectedStep].to}
            </strong>
          </div>
          <p style={{ color: "var(--text-muted)" }}>
            {steps[selectedStep].detail}
          </p>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.5rem 1.25rem 0.75rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { type: "request", label: "Requisicao" },
          { type: "response", label: "Resposta" },
          { type: "async", label: "Assincrono" },
        ].map(({ type, label }) => (
          <div
            key={type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              color: "var(--foreground)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: ARROW_COLORS[type],
                flexShrink: 0,
              }}
            />
            <svg width="24" height="8">
              <line
                x1="0"
                y1="4"
                x2="24"
                y2="4"
                stroke={ARROW_COLORS[type]}
                strokeWidth={2}
                strokeDasharray={type === "async" ? "4,3" : undefined}
              />
            </svg>
            {label}
          </div>
        ))}
        <div
          style={{
            fontSize: "0.6875rem",
            color: "var(--text-muted)",
            marginLeft: "auto",
          }}
        >
          Clique em uma etapa para ver detalhes
        </div>
      </div>
    </div>
  );
}
