"use client";
import { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.id}>
            <button
              className="accordion-trigger"
              data-open={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </span>
              <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                ▾
              </span>
            </button>
            {isOpen && (
              <div className="accordion-content animate-fade-in">
                {item.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
