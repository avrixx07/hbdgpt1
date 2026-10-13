export function Bow({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 135"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M98 56C40-7 9 4 20 39c6 24 48 34 78 22M104 55c59-66 91-50 76-14-9 21-46 26-76 20"
        fill="#cf7091"
        stroke="#944862"
        strokeWidth="2"
      />
      <path
        d="M94 60C76 80 62 100 42 104l27 1 11 20c11-16 19-39 21-62M106 62c6 25 25 47 43 55l-3-24 22-9c-24-1-43-12-57-25"
        fill="#dc8fa7"
        stroke="#944862"
        strokeWidth="2"
      />
      <path
        d="M27 25c25 1 46 17 68 32M169 25c-25 1-45 17-60 32"
        stroke="#edb3c4"
        strokeWidth="4"
      />
      <ellipse
        cx="101"
        cy="57"
        rx="13"
        ry="11"
        fill="#e7a6ba"
        stroke="#944862"
        strokeWidth="2"
      />
    </svg>
  );
}
export function Cake({ lit = false, blown = false }) {
  return (
    <svg
      className={`cake ${lit ? "lit" : ""} ${blown ? "blown" : ""}`}
      viewBox="0 0 420 330"
      role="img"
      aria-label={
        blown
          ? "Kue ulang tahun dengan lilin padam"
          : lit
            ? "Kue ulang tahun dengan lilin menyala"
            : "Kue ulang tahun pastel"
      }
    >
      <defs>
        <linearGradient id="icing" x2="0" y2="1">
          <stop stopColor="#fff9ee" />
          <stop offset="1" stopColor="#f4d6d6" />
        </linearGradient>
        <linearGradient id="cakebody" x2="0" y2="1">
          <stop stopColor="#edabc1" />
          <stop offset="1" stopColor="#ce7e9e" />
        </linearGradient>
      </defs>
      <ellipse
        cx="210"
        cy="299"
        rx="156"
        ry="18"
        fill="#a9657d"
        opacity=".13"
      />
      <ellipse
        cx="210"
        cy="287"
        rx="154"
        ry="20"
        fill="#fff9ed"
        stroke="#d7a5ac"
      />
      <path
        d="M83 181v87c0 33 254 33 254 0v-87"
        fill="url(#cakebody)"
        stroke="#b86c8d"
        strokeWidth="2"
      />
      <path
        d="M87 224q123 34 247 0M87 254q123 34 247 0"
        fill="none"
        stroke="#f7d9df"
        strokeWidth="4"
      />
      <ellipse
        cx="210"
        cy="180"
        rx="128"
        ry="40"
        fill="url(#icing)"
        stroke="#d59aaa"
        strokeWidth="2"
      />
      <path
        d="M83 181c8 22 13 9 21 28s16 24 24 0 23-6 30 4 22 20 30-1 26 2 31 11 21 12 28-7 25-11 29-1 19 12 26-6 25-7 35-28"
        fill="#fff5e9"
        stroke="#d59aaa"
        strokeWidth="2"
      />
      {[155, 210, 265].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 6}
            y={103 - (i % 2) * 19}
            width="12"
            height={69 + (i % 2) * 19}
            rx="4"
            fill={i === 1 ? "#bd9abf" : "#e699ae"}
            stroke="#a46884"
          />
          {[0, 1, 2].map((n) => (
            <path
              key={n}
              d={`M${x - 5} ${120 + n * 17}l10 -8`}
              stroke="#fff4e7"
              strokeWidth="3"
            />
          ))}
          <path
            className="flame"
            style={{ "--delay": `${i * 0.18}s` }}
            d={`M${x} ${94 - (i % 2) * 19}c-20-9-5-22 0-32 3 12 20 23 0 32`}
            fill="#edac57"
          />
          <path
            className="smoke"
            style={{ "--delay": `${i * 0.18}s` }}
            d={`M${x} 99q-12-15 1-26t0-22`}
            fill="none"
            stroke="#bda5aa"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}
      {[113, 145, 179, 214, 249, 283, 314].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={i < 3 ? 177 + i * 4 : 189 - (i - 3) * 5}
          r="9"
          fill="#fffaf0"
          stroke="#efd6d6"
        />
      ))}
      <path
        d="M184 250q25 19 51-2"
        fill="none"
        stroke="#fff8eb"
        strokeWidth="3"
      />
      <path d="M202 229c-9-15-21-1 0 12 23-15 8-27 0-12" fill="#fff8eb" />
    </svg>
  );
}
export function Gift({ open = false }) {
  return (
    <div className={`gift ${open ? "unwrapped" : ""}`} aria-hidden="true">
      <div className="gift-glow" />
      <div className="gift-lid">
        <Bow />
      </div>
      <div className="gift-box">
        <span>pour toi ♡</span>
      </div>
    </div>
  );
}
export function Hug() {
  return (
    <svg
      className="hug"
      viewBox="0 0 240 170"
      role="img"
      aria-label="Dua karakter saling berpelukan"
    >
      <g className="hug-left">
        <path
          d="M53 143V93c-34-59 52-100 70-43 17 48-2 89-2 93"
          fill="#fff5e7"
          stroke="#9b6979"
          strokeWidth="3"
        />
        <path
          d="M75 74h2m26 0h2"
          stroke="#78384d"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M80 86q9 10 18 0"
          fill="none"
          stroke="#78384d"
          strokeWidth="2"
        />
      </g>
      <g className="hug-right">
        <path
          d="M124 143V93c-28-59 54-100 72-43 17 48-2 89-2 93"
          fill="#e8a7ba"
          stroke="#9b6979"
          strokeWidth="3"
        />
        <path
          d="M146 74h2m26 0h2"
          stroke="#78384d"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M149 86q9 10 18 0M107 111q26 26 51-6"
          fill="none"
          stroke="#78384d"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <path d="M119 32c-25-17-25-37-7-25 15-22 37 4 7 25" fill="#c5688c" />
    </svg>
  );
}
