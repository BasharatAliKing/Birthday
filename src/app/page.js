"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const TOTAL = 4;

/* ══════════════════════════════════════
   STAR / GLITTER CANVAS
   ══════════════════════════════════════ */
function StarCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.014 + 0.004,
    }));

    const glitColors = [
      "rgba(255,110,180,", "rgba(192,132,252,", "rgba(251,191,36,",
      "rgba(34,211,238,",  "rgba(255,255,255,", "rgba(74,222,128,",
    ];
    const glitters = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.5 + 0.1),
      color: glitColors[Math.floor(Math.random() * glitColors.length)],
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.007,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.phase += s.speed;
        const a = 0.2 + 0.6 * Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      glitters.forEach(g => {
        g.phase += g.speed;
        const a = 0.12 + 0.5 * Math.abs(Math.sin(g.phase));
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = g.color + a + ")";
        ctx.fill();
        g.x += g.dx;
        g.y += g.dy;
        if (g.y < -10) { g.y = canvas.height + 10; g.x = Math.random() * canvas.width; }
        if (g.x < -10) g.x = canvas.width + 10;
        if (g.x > canvas.width + 10) g.x = -10;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} id="star-canvas" />;
}

/* ══════════════════════════════════════
   BIRTHDAY EFFECTS (all 3 on click)
   ══════════════════════════════════════ */
function triggerBirthdayEffects(btnEl) {
  const rect = btnEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // 1. Screen flash
  const flash = document.createElement("div");
  flash.className = "screen-flash";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 550);

  // 2. Fireworks — burst from button + 2 extra random points
  const fwEmojis = ["✨","🌟","💫","🎉","🎊","🌸","⭐","🔥","🎆","💥","🎇","🎈"];
  const origins = [
    { x: cx, y: cy },
    { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
    { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
  ];
  origins.forEach((o, oi) => {
    const count = oi === 0 ? 14 : 8;
    setTimeout(() => {
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "fw-piece";
        el.textContent = fwEmojis[Math.floor(Math.random() * fwEmojis.length)];
        const angle = (360 / count) * i + Math.random() * 10;
        const dist = 80 + Math.random() * 100;
        const rad = (angle * Math.PI) / 180;
        el.style.cssText = `left:${o.x}px;top:${o.y}px;--fe:translate(${Math.cos(rad)*dist}px,${Math.sin(rad)*dist}px)`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1600);
      }
    }, oi * 150);
  });

  // 3. Confetti rain
  const cfColors = ["#f43f8e","#a855f7","#fbbf24","#22d3ee","#4ade80","#fb923c","#f9a8d4","#c084fc","#818cf8","#86efac"];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "cf-piece";
      const h = 6 + Math.random() * 10;
      el.style.cssText = `
        left:${Math.random() * window.innerWidth}px;
        background:${cfColors[Math.floor(Math.random() * cfColors.length)]};
        width:${5 + Math.random() * 6}px; height:${h}px;
        --cd:${1.4 + Math.random() * 1.5}s;
        --cr:${(Math.random() - 0.5) * 720}deg;
        --cx:${(Math.random() - 0.5) * 200}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, Math.random() * 400);
  }

  // 4. Balloons floating up
  const balloonEmojis = ["🎈","🎀","🎊","🎁","🧁"];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "balloon";
      el.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
      const dur = 2.2 + Math.random() * 1.5;
      const rot = (Math.random() - 0.5) * 30;
      el.style.cssText = `
        left:${15 + Math.random() * 70}%;
        bottom:-60px;
        --bd:${dur}s;
        --br:${rot}deg;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (dur + 0.2) * 1000);
    }, i * 120);
  }
}

/* ══════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════ */
function EmojiWrap({ e }) {
  return (
    <div className="emoji-wrap">
      <div className="e-ring" />
      <div className="e-ring2" />
      <span className="emoji-float">{e}</span>
    </div>
  );
}
function Divider({ g }) {
  return <div className="div" style={{ background: g }} />;
}
function Dots({ cur }) {
  return (
    <div className="dots">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div key={i} className={`dot${i === cur ? " on" : ""}`} />
      ))}
    </div>
  );
}

function Btn({ cls, label, onClick }) {
  const ref = useRef(null);
  const handle = (e) => {
    const el = ref.current;
    el.classList.remove("boom");
    void el.offsetWidth; // reflow
    el.classList.add("boom");
    triggerBirthdayEffects(el);
    setTimeout(() => onClick(e), 60);
  };
  return (
    <button ref={ref} className={`btn ${cls}`} onClick={handle}>
      {label}
    </button>
  );
}

/* ══════════════════════════════════════
   CARD 1 — The Birthday Drop 🎉
   ══════════════════════════════════════ */
function Card1({ next }) {
  return (
    <div className="card active c1">
      <div className="card-bg-dots" />
      <EmojiWrap e="🎆" />
      <p className="step-label">✦ July 29, 2026 ✦</p>
      <h1 className="card-title gp">July 29 Just Hit Different</h1>
      <p className="card-subtitle">The countdown is officially over 🎊</p>
      <Divider g="linear-gradient(90deg,#7c3aed,#f43f8e,#7c3aed)" />
      <p className="card-body">
        Some birthdays come and go. <strong style={{ color: "#c084fc" }}>This one</strong> is different.
        Today marks another year completed by someone who shows up, works hard,
        and keeps going no matter what. July 29th is now officially a holiday —
        because <strong style={{ color: "#fda4c8" }}>Farwa Shakir</strong> was born on this day,
        and that alone deserves a full-on celebration. 🎆
      </p>
      <Btn cls="b-purple" label="Let's Go 🚀" onClick={next} />
      <Dots cur={0} />
    </div>
  );
}

/* ══════════════════════════════════════
   CARD 2 — Farwa Shakir Spotlight 🌟
   ══════════════════════════════════════ */
function Card2({ next }) {
  return (
    <div className="card active c2">
      <div className="card-bg-dots" />
      <EmojiWrap e="🌟" />
      <p className="step-label">✦ Today's Main Character ✦</p>
      <h1 className="card-title gk">Farwa Shakir</h1>
      <p className="card-subtitle">Born on July 29 · Certified Legend 👑</p>
      <Divider g="linear-gradient(90deg,#be185d,#fbbf24,#be185d)" />
      <div className="pill-row">
        <div className="pill">
          <span className="pill-v gk">29</span>
          <span className="pill-l">July</span>
        </div>
        <div className="pill">
          <span className="pill-v gg">🦁</span>
          <span className="pill-l">Leo</span>
        </div>
        <div className="pill">
          <span className="pill-v gk">100%</span>
          <span className="pill-l">That Girl</span>
        </div>
        <div className="pill">
          <span className="pill-v gg">∞</span>
          <span className="pill-l">Potential</span>
        </div>
      </div>
      <p className="card-body">
        Born under the fiery Leo sun, <strong style={{ color: "#fda4c8" }}>Farwa Shakir</strong> is
        the kind of person who walks into a room and immediately raises the energy
        level by 100%. Confident. Driven. Unstoppable. This year is already yours —
        you just have to claim it. 🔥
      </p>
      <Btn cls="b-pink" label="What's Next? 🎀" onClick={next} />
      <Dots cur={1} />
    </div>
  );
}

/* ══════════════════════════════════════
   CARD 3 — Birthday Wishes 🎁
   ══════════════════════════════════════ */
function Card3({ next }) {
  const wishes = [
    { icon: "🏆", text: "May every goal you set this year turn into a victory lap." },
    { icon: "🚀", text: "May this be the year you launch into the life you always pictured." },
    { icon: "🎯", text: "May every decision you make hit its mark perfectly." },
    { icon: "🌤️", text: "May your toughest days be outnumbered 10-to-1 by great ones." },
    { icon: "👑", text: "May you step into this new year knowing exactly how powerful you are." },
  ];
  return (
    <div className="card active c3">
      <div className="card-bg-dots" />
      <EmojiWrap e="🎁" />
      <p className="step-label">✦ 5 Wishes for Farwa ✦</p>
      <h1 className="card-title gc">Your Birthday Gifts</h1>
      <p className="card-subtitle">No wrapping paper needed for these ones</p>
      <Divider g="linear-gradient(90deg,#0e7490,#a855f7,#0e7490)" />
      <ul className="wish-list">
        {wishes.map((w, i) => (
          <li key={i} className="wi">
            <span className="wi-icon">{w.icon}</span>
            <span>{w.text}</span>
          </li>
        ))}
      </ul>
      <Btn cls="b-cyan" label="Final Surprise 🎊" onClick={next} />
      <Dots cur={2} />
    </div>
  );
}

/* ══════════════════════════════════════
   CARD 4 — Grand Finale 🎊
   ══════════════════════════════════════ */
function Card4({ next }) {
  return (
    <div className="card active c4">
      <div className="card-bg-dots" />
      <div className="orbit1" />
      <div className="orbit2" />

      <span className="crown">🎊</span>

      <div style={{ margin: "0.8rem 0 0.4rem" }}>
        <div className="hb-big gr">Happy Birthday</div>
        <div className="hb-name gr">Farwa Shakir!</div>
      </div>

      <p className="card-subtitle" style={{ marginTop: "0.6rem" }}>
        July 29, 2026 · One Legendary Day 🎂
      </p>

      <Divider g="linear-gradient(90deg,#fbbf24,#f43f8e,#a855f7,#22d3ee,#fbbf24)" />

      <div className="chip-row">
        <span className="chip">🎂 Birthday Queen</span>
        <span className="chip">🦁 Leo Season</span>
        <span className="chip">🏆 Champion</span>
        <span className="chip">✨ July 29</span>
        <span className="chip">🚀 Next Level</span>
      </div>

      <p className="card-body">
        Here's to <strong style={{ color: "#fda4c8" }}>Farwa Shakir</strong> —
        the person who made July 29th worth celebrating. Every candle on
        this cake stands for a challenge conquered, a lesson learned, and a
        level unlocked. The next chapter starts <em style={{ color: "#fde68a" }}>right now</em>.
        Make it your most legendary one yet. Happy Birthday! 🥳🎆🌟
      </p>

      <Btn cls="b-rainbow" label="🎉 Celebrate Again! 🎉" onClick={next} />
      <Dots cur={3} />
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════ */
export default function BirthdayPage() {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);

  const next = useCallback(() => {
    setCur(c => (c + 1) % TOTAL);
    setKey(k => k + 1);
  }, []);

  const cards = [
    <Card1 key={key} next={next} />,
    <Card2 key={key} next={next} />,
    <Card3 key={key} next={next} />,
    <Card4 key={key} next={next} />,
  ];

  return (
    <>
      {/* Aurora background */}
      <div className="aurora-wrap">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Star + glitter canvas */}
      <StarCanvas />

      {/* Active card */}
      <div className="scene">{cards[cur]}</div>
    </>
  );
}
