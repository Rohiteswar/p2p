import { motion } from 'motion/react'

/* ── Feature icon components ───────────────────────────────────────────── */

function OrderbookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Bid rows */}
      <line x1="4" y1="7"  x2="12" y2="7"  stroke="#14f195" strokeWidth="2" />
      <line x1="4" y1="10" x2="10" y2="10" stroke="#14f195" strokeWidth="2" opacity=".7" />
      <line x1="4" y1="13" x2="8"  y2="13" stroke="#14f195" strokeWidth="2" opacity=".45" />
      {/* Ask rows */}
      <line x1="13" y1="7"  x2="20" y2="7"  stroke="#ff4d6a" strokeWidth="2" />
      <line x1="14" y1="10" x2="20" y2="10" stroke="#ff4d6a" strokeWidth="2" opacity=".7" />
      <line x1="16" y1="13" x2="20" y2="13" stroke="#ff4d6a" strokeWidth="2" opacity=".45" />
      {/* Spread line */}
      <line x1="12" y1="4" x2="12" y2="20" strokeWidth="1" stroke="currentColor" opacity=".25" strokeDasharray="2 2" />
    </svg>
  )
}

function ComputeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* CPU chip outline */}
      <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Pins left */}
      <line x1="4" y1="9.5"  x2="7"  y2="9.5"  stroke="currentColor" strokeWidth="1.6" />
      <line x1="4" y1="14.5" x2="7"  y2="14.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Pins right */}
      <line x1="17" y1="9.5"  x2="20" y2="9.5"  stroke="currentColor" strokeWidth="1.6" />
      <line x1="17" y1="14.5" x2="20" y2="14.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Pins top */}
      <line x1="9.5"  y1="4" x2="9.5"  y2="7" stroke="currentColor" strokeWidth="1.6" />
      <line x1="14.5" y1="4" x2="14.5" y2="7" stroke="currentColor" strokeWidth="1.6" />
      {/* Pins bottom */}
      <line x1="9.5"  y1="17" x2="9.5"  y2="20" stroke="currentColor" strokeWidth="1.6" />
      <line x1="14.5" y1="17" x2="14.5" y2="20" stroke="currentColor" strokeWidth="1.6" />
      {/* Inner dot */}
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  )
}

function EscrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Vault body */}
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      {/* Shackle */}
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
      {/* Keyhole circle */}
      <circle cx="12" cy="15.5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      {/* Keyhole slot */}
      <line x1="12" y1="17.3" x2="12" y2="19" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function OrderTypesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Limit — horizontal bar */}
      <line x1="3" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="7" r="1.5" fill="currentColor" />
      {/* IOC — arrow right */}
      <line x1="3" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.6" />
      <polyline points="11 9.5 14 12 11 14.5" stroke="currentColor" strokeWidth="1.6" />
      {/* FOK — double arrow */}
      <line x1="3" y1="17" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" />
      <polyline points="14 14.5 17 17 14 19.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Post-Only — dash at right edge */}
      <line x1="20" y1="5" x2="20" y2="19" stroke="currentColor" strokeWidth="1.4" opacity=".35" strokeDasharray="2 2" />
    </svg>
  )
}

function GeyserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Signal arcs */}
      <path d="M5.5 17a9 9 0 0 1 0-10"  stroke="currentColor" strokeWidth="1.6" opacity=".4" />
      <path d="M8.5 14.5a5 5 0 0 1 0-5" stroke="currentColor" strokeWidth="1.6" opacity=".7" />
      <path d="M11.5 13a2 2 0 0 1 0-2"  stroke="currentColor" strokeWidth="1.6" />
      {/* Dot source */}
      <circle cx="15" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      {/* Right beam */}
      <line x1="17.2" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.6" opacity=".5" />
    </svg>
  )
}

function SDKIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Brackets */}
      <polyline points="7 8 3 12 7 16" stroke="currentColor" strokeWidth="1.8" />
      <polyline points="17 8 21 12 17 16" stroke="currentColor" strokeWidth="1.8" />
      {/* Slash */}
      <line x1="14" y1="5" x2="10" y2="19" stroke="currentColor" strokeWidth="1.6" opacity=".6" />
    </svg>
  )
}

/* ── Data ───────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    Icon:  OrderbookIcon,
    accent: '#9945ff',
    color:  'rgba(153,69,255,0.12)',
    title: 'On-Chain Orderbook',
    desc: 'Every order is a PDA. The book is fully verifiable on-chain — no off-chain state required for settlement.',
  },
  {
    Icon:  ComputeIcon,
    accent: '#14f195',
    color:  'rgba(20,241,149,0.1)',
    title: 'Ultra-Low Compute',
    desc: 'Under 5,000 CU per instruction. Built with Pinocchio 0.11 — no Anchor overhead, zero heap allocations.',
  },
  {
    Icon:  EscrowIcon,
    accent: '#3296ff',
    color:  'rgba(50,150,255,0.1)',
    title: 'Escrow-Based Safety',
    desc: 'Tokens lock in vault PDAs at placement. Fills and cancels atomically release the exact escrowed amount.',
  },
  {
    Icon:  OrderTypesIcon,
    accent: '#ff9632',
    color:  'rgba(255,150,50,0.1)',
    title: '4 Order Types',
    desc: 'Limit, IOC, FOK, and Post-Only. The on-chain router enforces IOC/FOK semantics immediately after placement.',
  },
  {
    Icon:  GeyserIcon,
    accent: '#9945ff',
    color:  'rgba(153,69,255,0.12)',
    title: 'Geyser Events',
    desc: 'Every state change emits a structured binary event via sol_log_data — ready for YellowstoneRPC indexing.',
  },
  {
    Icon:  SDKIcon,
    accent: '#14f195',
    color:  'rgba(20,241,149,0.1)',
    title: 'TypeScript SDK',
    desc: 'PDA derivation, instruction builders, account deserialization, and event decoding — all included.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 36, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Features() {
  return (
    <section id="features" className="section-lg">
      <div className="page-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '0.75rem' }}>
            Protocol
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            Built for real traders
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', maxWidth: 480, marginBottom: '3.5rem' }}>
            Every byte optimized for the SBPF runtime — raw Solana with no framework overhead.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="features-grid"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 0 40px rgba(153,69,255,0.1)', borderColor: 'rgba(255,255,255,0.12)' }}
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                cursor: 'default',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 11,
                background: f.color,
                border: `1px solid ${f.accent}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
                color: f.accent,
              }}>
                <f.Icon />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
