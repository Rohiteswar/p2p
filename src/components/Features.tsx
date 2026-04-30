import { motion } from 'motion/react'

const FEATURES = [
  {
    icon: '📒',
    color: 'rgba(153,69,255,0.12)',
    title: 'On-Chain Orderbook',
    desc: 'Every order is a PDA. The book is fully verifiable on-chain — no off-chain state required for settlement.',
  },
  {
    icon: '⚡',
    color: 'rgba(20,241,149,0.1)',
    title: 'Ultra-Low Compute',
    desc: 'Under 5,000 CU per instruction. Built with Pinocchio 0.11 — no Anchor overhead, zero heap allocations.',
  },
  {
    icon: '🔒',
    color: 'rgba(50,150,255,0.1)',
    title: 'Escrow-Based Safety',
    desc: 'Tokens lock in vault PDAs at placement. Fills and cancels atomically release the exact escrowed amount.',
  },
  {
    icon: '🔄',
    color: 'rgba(255,150,50,0.1)',
    title: '4 Order Types',
    desc: 'Limit, IOC, FOK, and Post-Only. The on-chain router enforces IOC/FOK semantics immediately after placement.',
  },
  {
    icon: '📡',
    color: 'rgba(153,69,255,0.12)',
    title: 'Geyser Events',
    desc: 'Every state change emits a structured binary event via sol_log_data — ready for YellowstoneRPC indexing.',
  },
  {
    icon: '🛠',
    color: 'rgba(20,241,149,0.1)',
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
    <section id="features" style={{ padding: '7rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.1rem',
          }}
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
                width: 42, height: 42, borderRadius: 10,
                background: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', marginBottom: '1rem',
              }}>
                {f.icon}
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
