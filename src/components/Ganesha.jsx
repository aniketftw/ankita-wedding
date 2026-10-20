import "./Ganesha.css";

const GOLD = "#c99a43";
const PEACH = "#f2b27a";
const PEACH_DARK = "#d98f55";
const ROSE = "#e9a3ae";

function Arm({ d }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={PEACH_DARK} strokeWidth="13" />
      <path d={d} stroke={PEACH} strokeWidth="10" />
    </g>
  );
}

function Ear() {
  return (
    <g>
      <path
        d="M78 72 C50 40 28 66 38 100 C46 118 70 108 78 92Z"
        fill={PEACH}
        stroke={PEACH_DARK}
        strokeWidth="1.2"
      />
      <path d="M74 75 C54 56 42 72 48 94 C54 104 68 98 74 88Z" fill="#f7c9bb" />
    </g>
  );
}

/* A gentle, stylised Ganesh ji: seated on a lotus, four arms (axe, lotus,
   modak bowl, blessing hand), crown, tusk and curled trunk. */
export default function Ganesha({ className = "" }) {
  return (
    <svg viewBox="0 0 200 232" className={className} aria-hidden="true">
      {/* halo */}
      <circle cx="100" cy="82" r="64" fill="rgba(255,236,170,.5)" stroke={GOLD} strokeWidth=".8" />
      <circle cx="100" cy="82" r="71" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />

      {/* lotus seat */}
      {[-66, -36, 36, 66, 0].map((a) => (
        <g key={a} transform={`rotate(${a} 100 226)`}>
          <path
            d="M100 226 C86 214 86 198 100 188 C114 198 114 214 100 226Z"
            fill="#f6c9cf"
            stroke="#d99aa4"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* belly */}
      <ellipse cx="100" cy="142" rx="48" ry="46" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1.2" />
      <path d="M72 112 Q92 150 128 168" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="100" cy="150" r="2.4" fill={PEACH_DARK} />

      {/* dhoti */}
      <path
        d="M54 160 Q100 182 146 160 L150 198 Q100 214 50 198Z"
        fill={ROSE}
        stroke={GOLD}
        strokeWidth="1.4"
      />
      <path d="M54 172 Q100 194 146 172" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="2 3" />

      {/* feet */}
      <ellipse cx="70" cy="204" rx="24" ry="9" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1.1" />
      <ellipse cx="130" cy="204" rx="24" ry="9" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1.1" />
      <circle cx="60" cy="204" r="3" fill="none" stroke={ROSE} strokeWidth="1.2" />
      <circle cx="140" cy="204" r="3" fill="none" stroke={ROSE} strokeWidth="1.2" />

      {/* ears sit behind the arms */}
      <Ear />
      <g transform="translate(200 0) scale(-1 1)">
        <Ear />
      </g>

      {/* arms and what they hold */}
      <Arm d="M68 116 Q38 124 22 98" />
      <path d="M21 96 L21 54" stroke="#8a5a30" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M21 56 Q41 47 39 68 Q30 66 21 71Z" fill="#cfd3d8" stroke="#8d949c" strokeWidth="1" />
      <circle cx="21" cy="94" r="6.5" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1" />

      <Arm d="M132 116 Q162 124 178 98" />
      <path d="M179 94 L179 72" stroke="#7d9a6a" strokeWidth="2.4" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="179" cy="61" rx="3.8" ry="7" fill="#f4a8b8" stroke="#d98a9c" strokeWidth=".7" transform={`rotate(${a} 179 68)`} />
      ))}
      <circle cx="179" cy="68" r="3.2" fill="#fff1c4" />
      <circle cx="179" cy="94" r="6.5" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1" />

      <Arm d="M64 140 Q46 150 40 164" />
      <path d="M20 166 Q38 192 56 166Z" fill="#e2b94c" stroke="#b58d2e" strokeWidth="1.1" />
      {[[29, 163], [38, 158], [47, 163]].map(([x, y]) => (
        <path key={x} d={`M${x - 5} ${y + 3} Q${x} ${y - 9} ${x + 5} ${y + 3}Z`} fill="#f7d58b" stroke={GOLD} strokeWidth=".9" />
      ))}
      <circle cx="40" cy="164" r="6.5" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1" />

      <Arm d="M136 140 Q154 150 160 164" />
      {[[154, 150, -24], [160, 147, -8], [166, 148, 10], [171, 153, 28]].map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx="2.7" ry="5.4" fill={PEACH} stroke={PEACH_DARK} strokeWidth=".9" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <circle cx="162" cy="164" r="9" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1" />
      <circle cx="162" cy="164" r="4" fill="none" stroke={ROSE} strokeWidth="1.3" />

      {/* necklace */}
      <path d="M76 104 Q100 124 124 104" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      {[84, 100, 116].map((x, i) => (
        <circle key={x} cx={x} cy={i === 1 ? 117 : 111} r="2.6" fill="#e0566b" />
      ))}

      {/* head */}
      <ellipse cx="100" cy="78" rx="28" ry="26" fill={PEACH} stroke={PEACH_DARK} strokeWidth="1.2" />

      {/* crown */}
      <path d="M76 56 C78 38 90 26 100 12 C110 26 122 38 124 56Z" fill="#e2b94c" stroke="#b58d2e" strokeWidth="1.1" />
      <path d="M76 55 Q100 64 124 55 L124 62 Q100 71 76 62Z" fill="#d4a63c" stroke="#b58d2e" strokeWidth=".8" />
      <circle cx="100" cy="24" r="3.8" fill="#e0566b" />
      <circle cx="100" cy="61" r="3.2" fill="#e0566b" />
      <circle cx="85" cy="60" r="2.3" fill="#6bb5a0" />
      <circle cx="115" cy="60" r="2.3" fill="#6bb5a0" />

      {/* face */}
      <path d="M93 68 Q100 80 107 68" fill="none" stroke="#d9455a" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="100" cy="73" r="1.7" fill="#d9455a" />
      <path d="M84 82 Q90 87 96 82" fill="none" stroke="#5a4036" strokeWidth="2" strokeLinecap="round" />
      <path d="M104 82 Q110 87 116 82" fill="none" stroke="#5a4036" strokeWidth="2" strokeLinecap="round" />

      {/* trunk and tusk */}
      <g fill="none" strokeLinecap="round">
        <path d="M100 90 C100 114 98 130 82 131 C72 132 68 122 77 118" stroke={PEACH_DARK} strokeWidth="17" />
        <path d="M100 90 C100 114 98 130 82 131 C72 132 68 122 77 118" stroke={PEACH} strokeWidth="14" />
        <path d="M100 98 C100 112 99 122 90 126" stroke={PEACH_DARK} strokeWidth="1" opacity=".5" />
      </g>
      <path d="M111 96 Q126 102 123 120 Q113 111 107 103Z" fill="#fffaf0" stroke="#cbb89a" strokeWidth="1" />
    </svg>
  );
}
