import { useState, useEffect, useCallback } from "react";
import {
  C, SKILLS, CATEGORIES, ROLES,
  getQuestions, getSkillFeedback, getOverallMessage,
  getSmartCTAs, computeScores,
} from "./data.js";

// ─── RADAR CHART ───
function RadarChart({ scores }) {
  const cx = 150, cy = 150, r = 110;
  const n = CATEGORIES.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;
  const pt = (i, pct) => {
    const a = start + i * step;
    const d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const grids = [25, 50, 75, 100];
  const data = CATEGORIES.map((c, i) => pt(i, scores[c.id] || 0));
  const path = data.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto" }}>
      {grids.map(lv => {
        const pts = CATEGORIES.map((_, i) => pt(i, lv));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";
        return <path key={lv} d={d} fill="none" stroke={C.gray200} strokeWidth={1} opacity={0.5} />;
      })}
      {CATEGORIES.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.gray200} strokeWidth={1} opacity={0.4} />;
      })}
      <path d={path} fill={C.orange} fillOpacity={0.15} stroke={C.orange} strokeWidth={2.5} />
      {data.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={CATEGORIES[i].color} stroke={C.white} strokeWidth={2} />
      ))}
      {CATEGORIES.map((c, i) => {
        const [x, y] = pt(i, 130);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 12, fontWeight: 700, fill: c.color, fontFamily: "'Libre Franklin', sans-serif" }}>
            {c.label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── SCORE BAR ───
function ScoreBar({ value, color, label }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 80); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.gray800 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: C.gray100, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${w}%`, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ───
function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 22 : 8, height: 8, borderRadius: 4,
          background: i < current ? C.orange : i === current ? C.orange : C.gray200,
          transition: "all 0.3s",
        }} />
      ))}
    </div>
  );
}

// ─── SHARED LOGO ───
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: C.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: C.orange, letterSpacing: 1,
      }}>365</div>
      <span style={{ fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: 0.5 }}>IMPACT 365</span>
    </div>
  );
}

// ─── SHARED STYLES ───
const WRAP = {
  minHeight: "100vh",
  background: `linear-gradient(165deg, ${C.cream} 0%, #F5F1EC 40%, #EDE8E2 100%)`,
  fontFamily: "'Libre Franklin', sans-serif",
  color: C.gray800,
  display: "flex",
  justifyContent: "center",
  padding: "20px 16px",
};
const HEAD = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  lineHeight: 1.25,
  color: C.navy,
  marginBottom: 8,
};
const SUB = { fontSize: 15, color: C.gray600, lineHeight: 1.65, marginBottom: 24 };
const BTN = (primary = true) => ({
  padding: "14px 28px", borderRadius: 10, fontFamily: "'Libre Franklin', sans-serif",
  fontSize: 15, fontWeight: 600, cursor: "pointer", display: "inline-flex",
  alignItems: "center", gap: 8, justifyContent: "center", textDecoration: "none",
  width: primary ? "100%" : "100%", boxSizing: "border-box",
  border: primary ? "none" : `1.5px solid ${C.gray200}`,
  background: primary ? C.orange : "transparent",
  color: primary ? C.white : C.gray600,
  transition: "all 0.2s",
});
const INPUT = {
  padding: "13px 16px", borderRadius: 10, border: `1.5px solid ${C.gray200}`,
  fontFamily: "'Libre Franklin', sans-serif", fontSize: 15, width: "100%",
  boxSizing: "border-box", outline: "none", color: C.navy, transition: "border-color 0.2s",
};

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [stage, setStage] = useState("intro");
  const [role, setRole] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [catScores, setCatScores] = useState({});
  const [skillScores, setSkillScores] = useState({});
  const [selOpt, setSelOpt] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [fade, setFade] = useState(true);

  const go = useCallback((fn) => {
    setFade(false);
    setTimeout(() => { fn(); setFade(true); window.scrollTo({ top: 0, behavior: "smooth" }); }, 250);
  }, []);

  function startQuiz(r) {
    const qs = getQuestions(r);
    setRole(r);
    setQuestions(qs);
    setQi(0);
    setAnswers([]);
    go(() => setStage("quiz"));
  }

  function answer(opt) {
    setSelOpt(opt);
    setTimeout(() => {
      const newAns = [...answers, opt];
      setAnswers(newAns);
      setSelOpt(null);
      if (qi < questions.length - 1) {
        go(() => setQi(qi + 1));
      } else {
        const { skillScores: ss, catScores: cs } = computeScores(newAns, questions);
        setSkillScores(ss);
        setCatScores(cs);
        go(() => setStage("preview"));
      }
    }, 300);
  }

  const overall = Object.keys(catScores).length
    ? Math.round(Object.values(catScores).reduce((a, b) => a + b, 0) / Object.values(catScores).length)
    : 0;

  const topGap = SKILLS.reduce((a, b) => ((skillScores[a.id] || 100) <= (skillScores[b.id] || 100) ? a : b), SKILLS[0]);
  const topStr = SKILLS.reduce((a, b) => ((skillScores[a.id] || 0) >= (skillScores[b.id] || 0) ? a : b), SKILLS[0]);

  const cardBase = {
    background: C.white, borderRadius: 16,
    boxShadow: "0 2px 24px rgba(26,43,74,0.06), 0 1px 4px rgba(26,43,74,0.04)",
    maxWidth: 640, width: "100%", padding: "36px 28px",
    opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 0.3s ease, transform 0.3s ease", alignSelf: "flex-start",
  };

  // ─── INTRO ───
  if (stage === "intro") return (
    <div style={WRAP}><div style={cardBase}>
      <Logo />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>
        Free Assessment
      </div>
      <h1 style={{ ...HEAD, fontSize: 27 }}>
        Discover the Gap Between Your Intentions and Your True Impact
      </h1>
      <p style={SUB}>
        You care deeply about the people you lead, teach, parent, or coach. But do they experience your
        intentions the way you mean them? This 5-minute assessment scores you across the 9 Interpersonal
        Leadership Skills and reveals exactly where your impact is landing — and where it's falling short.
      </p>
      <div style={{
        background: C.orangeGlow, borderRadius: 12, padding: "16px 20px", marginBottom: 24,
        borderLeft: `3px solid ${C.orange}`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>What you'll get:</div>
        <div style={{ fontSize: 13, color: C.gray600, lineHeight: 1.7 }}>
          Your Impact Score across 3 categories — Connect, Influence, and Inspire — plus
          personalized feedback on all 9 skills with role-specific quick wins you can use today.
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {["18 scenario-based questions", "Takes ~5 minutes", "Instant results"].map(t => (
          <span key={t} style={{ fontSize: 12, color: C.gray400 }}>✓ {t}</span>
        ))}
      </div>
      <button style={BTN()} onClick={() => go(() => setStage("role"))}
        onMouseOver={e => e.currentTarget.style.background = "#D4521F"}
        onMouseOut={e => e.currentTarget.style.background = C.orange}>
        Start the Assessment →
      </button>
    </div></div>
  );

  // ─── ROLE ───
  if (stage === "role") return (
    <div style={WRAP}><div style={cardBase}>
      <Logo />
      <h2 style={{ ...HEAD, fontSize: 22 }}>Which role best describes you?</h2>
      <p style={{ ...SUB, marginBottom: 20 }}>
        We'll tailor every question to your world so the feedback actually means something.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ROLES.map(r => (
          <button key={r.id} onClick={() => startQuiz(r.id)} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "16px 20px", borderRadius: 12, border: `1.5px solid ${C.gray200}`,
            background: C.white, cursor: "pointer", textAlign: "left",
            transition: "all 0.2s", fontFamily: "'Libre Franklin', sans-serif",
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.background = C.orangeGlow; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.background = C.white; }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: C.navy,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: C.orange, flexShrink: 0,
            }}>{r.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{r.label}</div>
              <div style={{ fontSize: 13, color: C.gray400, marginTop: 2 }}>{r.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div></div>
  );

  // ─── QUIZ ───
  if (stage === "quiz") {
    const q = questions[qi];
    const sk = SKILLS.find(s => s.id === q.skill);
    const cat = CATEGORIES.find(c => c.id === sk.cat);
    return (
      <div style={WRAP}><div style={cardBase}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: cat.color, letterSpacing: 1.5, textTransform: "uppercase" }}>
            {cat.label} · Skill {sk.num}
          </div>
          <div style={{ fontSize: 13, color: C.gray400, fontWeight: 500 }}>{qi + 1} / {questions.length}</div>
        </div>
        <ProgressBar current={qi} total={questions.length} />
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.navy, lineHeight: 1.45, marginBottom: 24 }}>
          {q.q}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.opts.map((opt, i) => {
            const sel = selOpt === opt;
            return (
              <button key={i} onClick={() => !selOpt && answer(opt)} style={{
                display: "block", width: "100%", padding: "15px 18px",
                borderRadius: 12, textAlign: "left", cursor: selOpt ? "default" : "pointer",
                border: `1.5px solid ${sel ? C.orange : C.gray200}`,
                background: sel ? C.orangeGlow : C.white,
                fontFamily: "'Libre Franklin', sans-serif", fontSize: 14,
                color: sel ? C.navy : C.gray800, lineHeight: 1.55,
                fontWeight: sel ? 600 : 400, transition: "all 0.2s",
              }}
              onMouseOver={e => { if (!selOpt) { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.background = C.orangeGlow; }}}
              onMouseOut={e => { if (!selOpt && !sel) { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.background = C.white; }}}>
                {opt.text}
              </button>
            );
          })}
        </div>
      </div></div>
    );
  }

  // ─── PREVIEW (email gate) ───
  if (stage === "preview") return (
    <div style={WRAP}><div style={cardBase}>
      <Logo />
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.orange, textTransform: "uppercase", marginBottom: 12 }}>
          Your Impact Score
        </div>
        <div style={{
          width: 120, height: 120, borderRadius: "50%", margin: "0 auto 16px",
          background: `conic-gradient(${C.orange} ${overall * 3.6}deg, ${C.gray100} 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", background: C.white,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.navy, lineHeight: 1 }}>{overall}</div>
            <div style={{ fontSize: 11, color: C.gray400, fontWeight: 500 }}>out of 100</div>
          </div>
        </div>
        <h2 style={{ ...HEAD, fontSize: 22, marginBottom: 12 }}>
          {overall >= 75 ? "Strong Foundation" : overall >= 55 ? "Room to Grow" : "Significant Gaps to Close"}
        </h2>
        <p style={{ ...SUB, fontSize: 14, maxWidth: 440, margin: "0 auto 16px" }}>
          {getOverallMessage(overall)}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ padding: 16, borderRadius: 12, background: C.tealGlow, border: `1px solid rgba(43,122,120,0.15)` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Top Strength</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{topStr.name}</div>
          <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{skillScores[topStr.id]}%</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: C.orangeGlow, border: `1px solid rgba(232,93,38,0.2)` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Biggest Gap</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{topGap.name}</div>
          <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{skillScores[topGap.id]}%</div>
        </div>
      </div>

      <div style={{ background: C.cream, borderRadius: 12, padding: 20, border: `1px solid ${C.gray200}` }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
          Unlock your full 9-Skill Scorecard
        </div>
        <div style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6, marginBottom: 16 }}>
          See your detailed breakdown across all 9 skills with personalized feedback, role-specific quick wins,
          and a tailored recommendation for closing your biggest gaps.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          <input type="text" placeholder="First name" value={firstName}
            onChange={e => setFirstName(e.target.value)} style={INPUT}
            onFocus={e => e.target.style.borderColor = C.orange}
            onBlur={e => e.target.style.borderColor = C.gray200} />
          <input type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)} style={INPUT}
            onFocus={e => e.target.style.borderColor = C.orange}
            onBlur={e => e.target.style.borderColor = C.gray200} />
        </div>
        <button style={{ ...BTN(), opacity: (email && firstName) ? 1 : 0.5 }}
          onClick={() => { if (email && firstName) go(() => setStage("results")); }}
          onMouseOver={e => { if (email && firstName) e.currentTarget.style.background = "#D4521F"; }}
          onMouseOut={e => e.currentTarget.style.background = C.orange}>
          Show My Full Results
        </button>
        <div style={{ fontSize: 11, color: C.gray400, textAlign: "center", marginTop: 10 }}>
          You'll also receive The Ripple Effect — our free weekly leadership newsletter. Unsubscribe anytime.
        </div>
      </div>
    </div></div>
  );

  // ─── FULL RESULTS ───
  if (stage === "results") {
    const sorted = [...SKILLS].sort((a, b) => (skillScores[b.id] || 0) - (skillScores[a.id] || 0));
    const tops = sorted.slice(0, 3);
    const gaps = sorted.slice(-3).reverse();
    const cta = getSmartCTAs(skillScores, catScores, role);

    return (
      <div style={WRAP}><div style={{ ...cardBase, maxWidth: 680 }}>
        <Logo />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.orange, textTransform: "uppercase", marginBottom: 8 }}>
          {firstName}'s Impact Scorecard
        </div>
        <h1 style={{ ...HEAD, fontSize: 24, marginBottom: 4 }}>Your 9-Skill Breakdown</h1>
        <p style={{ ...SUB, marginBottom: 28 }}>
          Personalized for your role as a {ROLES.find(r => r.id === role)?.label.toLowerCase()}.
        </p>

        {/* Radar */}
        <div style={{ marginBottom: 28 }}><RadarChart scores={catScores} /></div>

        {/* Category bars */}
        <div style={{ marginBottom: 28 }}>
          {CATEGORIES.map(cat => (
            <ScoreBar key={cat.id} value={catScores[cat.id]} color={cat.color} label={`${cat.label} — ${cat.desc}`} />
          ))}
        </div>

        {/* Overall */}
        <div style={{
          textAlign: "center", padding: 20, borderRadius: 12,
          background: C.navy, color: C.white, marginBottom: 32,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.orange, fontWeight: 700, marginBottom: 4 }}>
            Overall Impact Score
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{overall}</div>
          <div style={{ fontSize: 12, color: C.gray400, marginTop: 4 }}>out of 100</div>
        </div>

        {/* Strengths */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 14 }}>★ Your Strengths</h3>
          {tops.map(s => {
            const cat = CATEGORIES.find(c => c.id === s.cat);
            return (
              <div key={s.id} style={{
                padding: "16px 18px", borderRadius: 12, marginBottom: 10,
                background: C.tealGlow, border: "1px solid rgba(43,122,120,0.12)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginLeft: 8 }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.teal }}>{skillScores[s.id]}%</span>
                </div>
                <div style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6 }}>{getSkillFeedback(s.id, skillScores[s.id])}</div>
              </div>
            );
          })}
        </div>

        {/* Growth Opportunities */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.orange, marginBottom: 14 }}>⬆ Your Growth Opportunities</h3>
          {gaps.map(s => {
            const cat = CATEGORIES.find(c => c.id === s.cat);
            return (
              <div key={s.id} style={{
                padding: "16px 18px", borderRadius: 12, marginBottom: 10,
                background: C.orangeGlow, border: `1px solid rgba(232,93,38,0.15)`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginLeft: 8 }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.orange }}>{skillScores[s.id]}%</span>
                </div>
                <div style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6 }}>{getSkillFeedback(s.id, skillScores[s.id])}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Wins — role-specific */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
            Your Quick Wins — Start Today
          </h3>
          <p style={{ fontSize: 13, color: C.gray400, marginBottom: 16 }}>
            One actionable step for each of your three biggest growth areas, tailored for your role.
          </p>
          {cta.skillTips.map(({ skill, tip }) => (
            <div key={skill.id} style={{
              padding: "16px 18px", borderRadius: 12, marginBottom: 10,
              background: C.white, border: `1px solid ${C.gray200}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                Skill {skill.num}: {skill.name}
              </div>
              <div style={{ fontSize: 14, color: C.navy, lineHeight: 1.6, fontWeight: 500 }}>
                {tip}
              </div>
            </div>
          ))}
        </div>

        {/* All 9 Skills Detail */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 18 }}>
            All 9 Skills — Detailed Scores
          </h3>
          {CATEGORIES.map(cat => (
            <div key={cat.id} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: cat.color, textTransform: "uppercase",
                letterSpacing: 1.5, marginBottom: 10, paddingBottom: 6,
                borderBottom: `2px solid ${cat.color}`,
              }}>{cat.label}</div>
              {cat.skills.map(si => {
                const s = SKILLS[si];
                return <ScoreBar key={s.id} value={skillScores[s.id]} color={cat.color} label={`${s.num}. ${s.name}`} />;
              })}
            </div>
          ))}
        </div>

        {/* ═══ SMART CTAs ═══ */}
        <div style={{
          background: C.navy, borderRadius: 16, padding: "28px 24px",
          marginBottom: 20,
        }}>
          {/* Dynamic course recommendation */}
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.orange, textTransform: "uppercase", marginBottom: 10 }}>
              Your Personalized Recommendation
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
              color: C.white, lineHeight: 1.35, marginBottom: 8,
            }}>
              {cta.rec.headline}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
              {cta.rec.body}
            </div>

            {/* CTA 1: Course */}
            <div style={{
              background: "rgba(232,93,38,0.12)", borderRadius: 12, padding: "20px",
              border: "1px solid rgba(232,93,38,0.25)", marginBottom: 16, textAlign: "left",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.orange, textTransform: "uppercase", marginBottom: 6 }}>
                Coming Soon
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>
                The Impact Gap Course: {cta.rec.module}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
                A self-paced course built around the 9 Interpersonal Leadership Skills — with deep dives into
                the exact areas where your assessment revealed the most opportunity. Be the first to know when enrollment opens.
              </div>
              <a href="https://www.impact365.com/subscribe" target="_blank" rel="noopener noreferrer"
                style={{ ...BTN(), fontSize: 14, padding: "12px 20px" }}>
                Join the Course Waitlist →
              </a>
            </div>

            {/* CTA 2: Newsletter */}
            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px",
              border: "1px solid rgba(255,255,255,0.1)", textAlign: "left",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.teal, textTransform: "uppercase", marginBottom: 6 }}>
                Free Every Week
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>
                The Ripple Effect Newsletter
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
                One skill. One story. Every week. Practical, proven strategies for leaders, teachers, parents,
                and coaches who want to close the gap between intention and impact.
              </div>
              <a href="https://www.impact365.com/archive" target="_blank" rel="noopener noreferrer"
                style={{ ...BTN(false), color: C.white, borderColor: "rgba(255,255,255,0.2)", fontSize: 14, padding: "12px 20px" }}>
                Read The Ripple Effect →
              </a>
            </div>
          </div>

          {/* Share */}
          <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
              Share your Impact Score
            </div>
            <div style={{ fontSize: 14, color: C.white, fontWeight: 500 }}>
              "I just scored {overall}/100 on the Impact 365 Leadership Assessment. Find your gap: assessment.impact365.com"
            </div>
            <div style={{ fontSize: 12, color: C.orange, marginTop: 8 }}>#Impact365 #AIM</div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <a href="https://www.impact365.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: C.gray400, textDecoration: "none" }}>
            © 2026 Impact 365 · impact365.com
          </a>
        </div>
      </div></div>
    );
  }

  return null;
}
