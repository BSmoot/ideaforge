import { useState, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN SYSTEM TOKENS — switchable themes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const THEMES = {
  anvil: {
    label: "Anvil",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`,
    vars: {
      "--font-body": "'Outfit', system-ui, sans-serif",
      "--font-mono": "'JetBrains Mono', 'SF Mono', monospace",
      "--bg": "#0B0B0B",
      "--bg-subtle": "#131313",
      "--bg-muted": "#1C1C1C",
      "--surface": "#121212",
      "--surface-hover": "#191919",
      "--surface-selected": "#1A1A30",
      "--fg": "#E6E6E6",
      "--fg-sec": "#838383",
      "--fg-ter": "#565656",
      "--fg-inv": "#0B0B0B",
      "--border": "#262626",
      "--border-strong": "#E6E6E6",
      "--border-input": "#363636",
      "--accent": "#7C6CFF",
      "--accent-hover": "#8B7FFF",
      "--accent-text": "#A8A0FF",
      "--accent-subtle": "rgba(124,108,255,0.12)",
      "--accent-fg": "#FFFFFF",
      "--action": "#E6E6E6",
      "--action-text": "#0B0B0B",
      "--action-hover": "#C4C4C4",
      "--success": "#6EE7B7",
      "--success-bg": "rgba(110,231,183,0.10)",
      "--warning": "#FCD34D",
      "--warning-bg": "rgba(252,211,77,0.10)",
      "--error": "#FCA5A5",
      "--error-bg": "rgba(252,165,165,0.10)",
      "--radius": "0px",
    },
  },
  meridian: {
    label: "Meridian",
    fonts: "",
    vars: {
      "--font-body": "system-ui, -apple-system, sans-serif",
      "--font-mono": "'SF Mono', 'Fira Code', monospace",
      "--bg": "#111110",
      "--bg-subtle": "#1A1A19",
      "--bg-muted": "#222221",
      "--surface": "#1A1A19",
      "--surface-hover": "#222221",
      "--surface-selected": "rgba(5,160,140,0.12)",
      "--fg": "#e4e4e7",
      "--fg-sec": "#a1a1aa",
      "--fg-ter": "#71717a",
      "--fg-inv": "#111110",
      "--border": "#2a2a29",
      "--border-strong": "#e4e4e7",
      "--border-input": "#3a3a39",
      "--accent": "hsl(174,95%,35%)",
      "--accent-hover": "hsl(174,95%,40%)",
      "--accent-text": "hsl(174,80%,58%)",
      "--accent-subtle": "hsla(174,95%,35%,0.12)",
      "--accent-fg": "#FFFFFF",
      "--action": "#e4e4e7",
      "--action-text": "#111110",
      "--action-hover": "#c4c4c7",
      "--success": "#6EE7B7",
      "--success-bg": "rgba(110,231,183,0.10)",
      "--warning": "#FCD34D",
      "--warning-bg": "rgba(252,211,77,0.10)",
      "--error": "#FCA5A5",
      "--error-bg": "rgba(252,165,165,0.10)",
      "--radius": "0px",
    },
  },
  sage: {
    label: "Sage",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');`,
    vars: {
      "--font-body": "'Outfit', system-ui, sans-serif",
      "--font-mono": "'Space Mono', monospace",
      "--bg": "#0F0F11",
      "--bg-subtle": "#161618",
      "--bg-muted": "#1E1E21",
      "--surface": "#1A1A1D",
      "--surface-hover": "#222225",
      "--surface-selected": "rgba(46,211,183,0.10)",
      "--fg": "#D4D4D8",
      "--fg-sec": "#8A8A92",
      "--fg-ter": "#5A5A64",
      "--fg-inv": "#0F0F11",
      "--border": "rgba(255,255,255,0.10)",
      "--border-strong": "#D4D4D8",
      "--border-input": "rgba(255,255,255,0.15)",
      "--accent": "hsl(163,68%,62%)",
      "--accent-hover": "hsl(163,68%,68%)",
      "--accent-text": "hsl(163,68%,62%)",
      "--accent-subtle": "hsla(163,68%,62%,0.10)",
      "--accent-fg": "#0F0F11",
      "--action": "#D4D4D8",
      "--action-text": "#0F0F11",
      "--action-hover": "#B4B4B8",
      "--success": "#6EE7B7",
      "--success-bg": "rgba(110,231,183,0.10)",
      "--warning": "#FCD34D",
      "--warning-bg": "rgba(252,211,77,0.10)",
      "--error": "hsl(343,68%,62%)",
      "--error-bg": "hsla(343,68%,62%,0.10)",
      "--radius": "4px",
    },
  },
  atlas: {
    label: "Atlas",
    fonts: `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&family=Space+Mono:wght@400&display=swap');`,
    vars: {
      "--font-body": "'Inter', system-ui, sans-serif",
      "--font-mono": "'Space Mono', monospace",
      "--bg": "#0A0A0B",
      "--bg-subtle": "#111112",
      "--bg-muted": "#1A1A1B",
      "--surface": "rgba(255,255,255,0.04)",
      "--surface-hover": "rgba(255,255,255,0.07)",
      "--surface-selected": "rgba(242,105,90,0.10)",
      "--fg": "#FAFAF8",
      "--fg-sec": "#9CA3AF",
      "--fg-ter": "#6B7280",
      "--fg-inv": "#0A0A0B",
      "--border": "rgba(255,255,255,0.08)",
      "--border-strong": "#FAFAF8",
      "--border-input": "rgba(255,255,255,0.12)",
      "--accent": "#F2695A",
      "--accent-hover": "#F47E71",
      "--accent-text": "#F2695A",
      "--accent-subtle": "rgba(242,105,90,0.12)",
      "--accent-fg": "#FFFFFF",
      "--action": "#F2695A",
      "--action-text": "#FFFFFF",
      "--action-hover": "#E94D3C",
      "--success": "#2DD4BF",
      "--success-bg": "rgba(45,212,191,0.10)",
      "--warning": "#FBBF24",
      "--warning-bg": "rgba(251,191,36,0.10)",
      "--error": "#FCA5A5",
      "--error-bg": "rgba(252,165,165,0.10)",
      "--radius": "0px",
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CANDIDATES = [
  {
    id: "A",
    approach: "Data-forward, leads with metrics",
    excerpt: "Healthcare IT spending will reach $280B by 2028. The network modernization segment — your arena — captures 18% of that. Three inflection points are driving urgency: the HIPAA 2025 compliance deadline, the shift to hybrid cloud-edge architectures, and the collapse of legacy vendor support timelines.",
    scores: { clarity: 92, tone: 78, evidence: 95, brevity: 60 },
    confidence: 0.91,
  },
  {
    id: "B",
    approach: "Narrative-driven, stakeholder empathy",
    excerpt: "When Memorial Health's CISO walked into her Monday review, three of her four agenda items traced back to the same root cause: a network architecture designed for a world that no longer exists. She's not alone. The CIOs we spoke with share a single, clarifying anxiety — not whether to modernize, but whether they can do it without breaking what's already keeping patients alive.",
    scores: { clarity: 85, tone: 94, evidence: 72, brevity: 75 },
    confidence: 0.87,
  },
  {
    id: "C",
    approach: "Contrarian, challenges assumptions",
    excerpt: "The conventional wisdom — that healthcare network spending follows compliance deadlines — is wrong. Our research across 47 health systems shows buying decisions cluster around three events that have nothing to do with regulations: new EHR deployments, merger integrations, and security incidents. If you're timing your outreach to HIPAA cycles, you're arriving six months late.",
    scores: { clarity: 88, tone: 82, evidence: 90, brevity: 82 },
    confidence: 0.83,
  },
];

const RUBRIC = [
  { id: "clarity", label: "Clarity", weight: 3 },
  { id: "tone", label: "Tone Match", weight: 2 },
  { id: "evidence", label: "Evidence", weight: 3 },
  { id: "brevity", label: "Brevity", weight: 1 },
];

const TASTE_SIGNALS = [
  { signal: "Prefers contrarian framing over consensus", confidence: 84, basis: "12 selections" },
  { signal: "Rejects passive voice consistently", confidence: 92, basis: "31 corrections" },
  { signal: "Values data specificity over narrative color", confidence: 76, basis: "8 selections" },
  { signal: "Prefers shorter openings (< 2 sentences)", confidence: 68, basis: "5 selections" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ThemeSwitcher({ current, onChange }) {
  return (
    <div style={{ display: "flex", gap: "1px", background: "var(--border)" }}>
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            background: key === current ? "var(--surface-selected)" : "var(--surface)",
            color: key === current ? "var(--accent-text)" : "var(--fg-sec)",
            border: "none",
            padding: "6px 12px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: "var(--radius)",
            transition: "all 120ms ease",
          }}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}

function ScoreBar({ value, max = 100 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
      <div style={{ flex: 1, height: "4px", background: "var(--bg-muted)", borderRadius: "var(--radius)" }}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: value >= 85 ? "var(--success)" : value >= 70 ? "var(--accent)" : "var(--warning)",
            borderRadius: "var(--radius)",
            transition: "width 300ms ease",
          }}
        />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--fg-sec)", minWidth: "24px", textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

function CandidateCard({ candidate, isSelected, annotations, onAnnotate, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected ? "var(--surface-selected)" : "var(--surface)",
        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "all 200ms ease",
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => onSelect(candidate.id)}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
            textTransform: "uppercase", color: "var(--accent-text)",
            background: "var(--accent-subtle)", padding: "3px 8px",
            borderRadius: "var(--radius)",
          }}>
            Candidate {candidate.id}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            color: candidate.confidence >= 0.9 ? "var(--success)" : "var(--fg-sec)",
          }}>
            {Math.round(candidate.confidence * 100)}% conf
          </span>
        </div>
        {isSelected && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
            textTransform: "uppercase", color: "var(--accent-fg)",
            background: "var(--accent)", padding: "3px 8px", borderRadius: "var(--radius)",
          }}>
            Selected
          </span>
        )}
      </div>

      {/* Approach */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
        color: "var(--fg)", letterSpacing: "-0.01em",
      }}>
        {candidate.approach}
      </div>

      {/* Excerpt with confidence gradient */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6,
        color: candidate.confidence >= 0.85 ? "var(--fg)" : "var(--fg-sec)",
        borderLeft: candidate.confidence < 0.85 ? "2px dotted var(--border-input)" : "2px solid var(--accent)",
        paddingLeft: "12px",
        opacity: candidate.confidence >= 0.85 ? 1 : 0.85,
      }}>
        {candidate.excerpt}
      </div>

      {/* Scores */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
        {RUBRIC.map((dim) => (
          <div key={dim.id}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
              textTransform: "uppercase", color: "var(--fg-ter)", marginBottom: "4px",
            }}>
              {dim.label}
            </div>
            <ScoreBar value={candidate.scores[dim.id]} />
          </div>
        ))}
      </div>

      {/* Annotation buttons */}
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        {[
          { emoji: "↑", label: "Strong", value: "up" },
          { emoji: "↓", label: "Weak", value: "down" },
          { emoji: "◆", label: "Note", value: "note" },
        ].map((btn) => {
          const isActive = annotations.includes(btn.value);
          return (
            <button
              key={btn.value}
              onClick={(e) => { e.stopPropagation(); onAnnotate(candidate.id, btn.value); }}
              style={{
                background: isActive ? "var(--accent-subtle)" : "transparent",
                color: isActive ? "var(--accent-text)" : "var(--fg-ter)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "4px 10px",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 120ms ease",
              }}
            >
              {btn.emoji} {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RubricSidebar({ rubric, candidates, selected }) {
  const weightedScores = candidates.map((c) => {
    const total = rubric.reduce((sum, dim) => sum + c.scores[dim.id] * dim.weight, 0);
    const maxTotal = rubric.reduce((sum, dim) => sum + 100 * dim.weight, 0);
    return { id: c.id, score: Math.round((total / maxTotal) * 100) };
  });

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "1.5rem",
      display: "flex", flexDirection: "column", gap: "1.25rem",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
        textTransform: "uppercase", color: "var(--fg-ter)",
        paddingBottom: "8px", borderBottom: "1px solid var(--border-strong)",
      }}>
        Rubric / Weighted Scores
      </div>

      {/* Dimension weights */}
      {rubric.map((dim) => (
        <div key={dim.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
              textTransform: "uppercase", color: "var(--fg-sec)",
            }}>
              {dim.label}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--fg-ter)",
            }}>
              {"●".repeat(dim.weight)}{"○".repeat(3 - dim.weight)}
            </span>
          </div>
          {/* Per-candidate mini bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {candidates.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  color: selected === c.id ? "var(--accent-text)" : "var(--fg-ter)",
                  width: "10px",
                }}>
                  {c.id}
                </span>
                <div style={{ flex: 1, height: "3px", background: "var(--bg-muted)", borderRadius: "var(--radius)" }}>
                  <div style={{
                    width: `${c.scores[dim.id]}%`, height: "100%",
                    background: selected === c.id ? "var(--accent)" : "var(--fg-ter)",
                    borderRadius: "var(--radius)", transition: "all 200ms",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Weighted totals */}
      <div style={{ borderTop: "1px solid var(--border-strong)", paddingTop: "12px" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
          textTransform: "uppercase", color: "var(--fg-ter)", marginBottom: "8px",
        }}>
          Composite Score
        </div>
        {weightedScores
          .sort((a, b) => b.score - a.score)
          .map((ws) => (
            <div key={ws.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 0",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                color: selected === ws.id ? "var(--accent-text)" : "var(--fg)",
              }}>
                Candidate {ws.id}
              </span>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "20px", fontWeight: 600,
                letterSpacing: "-0.03em",
                color: selected === ws.id ? "var(--accent-text)" : "var(--fg)",
              }}>
                {ws.score}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function TasteProfile({ signals }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "1.5rem",
      display: "flex", flexDirection: "column", gap: "1rem",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
        textTransform: "uppercase", color: "var(--fg-ter)",
        paddingBottom: "8px", borderBottom: "1px solid var(--border-strong)",
      }}>
        Your Taste Profile
      </div>
      {signals.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "13px",
            color: s.confidence >= 80 ? "var(--fg)" : "var(--fg-sec)",
            letterSpacing: "-0.006em",
          }}>
            {s.signal}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ flex: 1, height: "2px", background: "var(--bg-muted)", borderRadius: "var(--radius)" }}>
              <div style={{
                width: `${s.confidence}%`, height: "100%",
                background: s.confidence >= 80 ? "var(--accent)" : "var(--fg-ter)",
                borderRadius: "var(--radius)",
              }} />
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--fg-ter)",
              whiteSpace: "nowrap",
            }}>
              {s.confidence}% / {s.basis}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function JudgmentCapture({ selected, onSubmit }) {
  const [reason, setReason] = useState("");
  const quickLabels = ["Stronger argument", "Better tone match", "More specific data", "Cleaner structure", "Contrarian angle"];
  
  if (!selected) return null;

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--accent)",
      borderRadius: "var(--radius)", padding: "1.5rem",
      display: "flex", flexDirection: "column", gap: "12px",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
        textTransform: "uppercase", color: "var(--accent-text)",
      }}>
        Why Candidate {selected}?
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {quickLabels.map((label) => (
          <button
            key={label}
            onClick={() => setReason(label)}
            style={{
              background: reason === label ? "var(--accent-subtle)" : "transparent",
              color: reason === label ? "var(--accent-text)" : "var(--fg-sec)",
              border: `1px solid ${reason === label ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "4px 10px",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 100ms ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Or type your reasoning..."
        style={{
          background: "var(--bg)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "8px 12px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          outline: "none",
        }}
      />
      <button
        onClick={() => onSubmit(reason)}
        style={{
          background: "var(--action)",
          color: "var(--action-text)",
          border: "none",
          borderRadius: "var(--radius)",
          padding: "10px 16px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          alignSelf: "flex-start",
          transition: "all 80ms ease",
        }}
      >
        Confirm Selection
      </button>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN HUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function TasteMakerHUD() {
  const [theme, setTheme] = useState("anvil");
  const [selected, setSelected] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentTheme = THEMES[theme];

  const handleAnnotate = (candidateId, type) => {
    setAnnotations((prev) => {
      const current = prev[candidateId] || [];
      if (current.includes(type)) {
        return { ...prev, [candidateId]: current.filter((t) => t !== type) };
      }
      return { ...prev, [candidateId]: [...current, type] };
    });
  };

  const handleSubmit = (reason) => {
    setSubmitted(true);
  };

  const cssVars = Object.entries(currentTheme.vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join("\n");

  return (
    <div>
      <style>{`
        ${currentTheme.fonts}
        .tm-root { ${cssVars} }
        .tm-root * { box-sizing: border-box; }
        .tm-root ::-webkit-scrollbar { width: 6px; }
        .tm-root ::-webkit-scrollbar-track { background: var(--bg-subtle); }
        .tm-root ::-webkit-scrollbar-thumb { background: var(--border); }
      `}</style>

      <div
        className="tm-root"
        style={{
          background: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "var(--font-body)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border-strong)",
          background: "var(--surface)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
              textTransform: "uppercase", color: "var(--fg-ter)",
            }}>
              Ideaforge
            </span>
            <span style={{ color: "var(--fg-ter)" }}>/</span>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
              color: "var(--fg)", letterSpacing: "-0.01em",
            }}>
              Healthcare CIO Playbook — Opening Section
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              background: "var(--accent-subtle)", color: "var(--accent-text)",
              padding: "3px 8px", borderRadius: "var(--radius)",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              Evaluation
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              color: "var(--fg-ter)", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Design System
            </span>
            <ThemeSwitcher current={theme} onChange={setTheme} />
          </div>
        </div>

        {/* Main content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "1px",
          background: "var(--border)",
          flex: 1,
        }}>
          {/* Left: Comparison Theater */}
          <div style={{
            background: "var(--bg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}>
            {/* Theater header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
                textTransform: "uppercase", color: "var(--fg-ter)",
              }}>
                Comparison Theater / 3 Candidates
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  color: "var(--fg-ter)", padding: "4px 8px",
                  border: "1px solid var(--border)", borderRadius: "var(--radius)",
                }}>
                  Semantic Diff
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  color: "var(--fg-ter)", padding: "4px 8px",
                  border: "1px solid var(--border)", borderRadius: "var(--radius)",
                }}>
                  Abstraction ↑↓
                </span>
              </div>
            </div>

            {/* Candidates */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {CANDIDATES.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  isSelected={selected === c.id}
                  annotations={annotations[c.id] || []}
                  onAnnotate={handleAnnotate}
                  onSelect={setSelected}
                />
              ))}
            </div>

            {/* Judgment capture */}
            {selected && !submitted && (
              <JudgmentCapture selected={selected} onSubmit={handleSubmit} />
            )}
            {submitted && (
              <div style={{
                background: "var(--success-bg)",
                border: "1px solid var(--success)",
                borderRadius: "var(--radius)",
                padding: "16px 20px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{ color: "var(--success)", fontSize: "16px" }}>✓</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--success)" }}>
                  Selection recorded. Judgment captured and fed to calibration.
                </span>
              </div>
            )}
          </div>

          {/* Right: Rubric + Taste Profile */}
          <div style={{
            background: "var(--bg-subtle)",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}>
            <RubricSidebar rubric={RUBRIC} candidates={CANDIDATES} selected={selected} />
            <TasteProfile signals={TASTE_SIGNALS} />

            {/* Diminishing returns warning */}
            <div style={{
              background: "var(--warning-bg)",
              border: "1px solid var(--warning)",
              borderLeft: "2px solid var(--warning)",
              borderRadius: "var(--radius)",
              padding: "12px",
              display: "flex", flexDirection: "column", gap: "4px",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.05em",
                textTransform: "uppercase", color: "var(--warning)",
              }}>
                Diminishing Returns
              </span>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--fg-sec)",
              }}>
                Round 3 of 3. Last two rounds changed &lt;4% of output. Consider selecting.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
