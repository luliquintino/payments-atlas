"use client";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  variant?: "text" | "card" | "circle";
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  text: { height: 16, width: "60%", borderRadius: 4 },
  card: { height: 120, width: "100%", borderRadius: 12 },
  circle: { width: 48, height: 48, borderRadius: "50%" },
};

export default function Skeleton({
  width,
  height,
  borderRadius,
  variant,
}: SkeletonProps) {
  const base: React.CSSProperties = {
    width: "100%",
    height: 20,
    borderRadius: 4,
    background: "var(--border)",
  };

  const variantStyle = variant ? VARIANT_STYLES[variant] : {};

  const merged: React.CSSProperties = {
    ...base,
    ...variantStyle,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
  };

  return <div className="skeleton" style={merged} />;
}
