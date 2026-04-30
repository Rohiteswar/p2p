import { useState } from 'react'
import { motion } from 'motion/react'

const PROGRAM_ID = 'HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18'
const EXPLORER_URL = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`

const LINKS = [
  {
    label: 'Program Account',
    href: EXPLORER_URL,
    sub: 'View bytecode, balance & metadata',
    color: 'var(--purple)',
    bg: 'rgba(153,69,255,0.08)',
    border: 'rgba(153,69,255,0.18)',
    icon: <ProgramIcon />,
  },
  {
    label: 'Transactions',
    href: `${EXPLORER_URL}&tab=history`,
    sub: 'Browse all on-chain activity',
    color: 'var(--green)',
    bg: 'rgba(20,241,149,0.07)',
    border: 'rgba(20,241,149,0.18)',
    icon: <TxIcon />,
  },
  {
    label: 'Anchor IDL',
    href: `${EXPLORER_URL}&tab=anchor-program`,
    sub: 'Inspect instruction schemas',
    color: '#3296ff',
    bg: 'rgba(50,150,255,0.08)',
    border: 'rgba(50,150,255,0.18)',
    icon: <IdlIcon />,
  },
]

export default function ContractExplorer() {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(PROGRAM_ID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <section style={{ padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '0.75rem' }}>
            On-Chain
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            Verify it yourself
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', maxWidth: 480, lineHeight: 1.7 }}>
            The contract is live on Solana Devnet. Every instruction, account, and event is fully verifiable on-chain.
          </p>
        </motion.div>

        {/* Address bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{
            padding: '0.2rem 0.65rem', borderRadius: 99,
            background: 'rgba(255,200,50,0.08)',
            border: '1px solid rgba(255,200,50,0.2)',
            fontSize: '0.68rem', fontWeight: 600, color: '#ffc832',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ffc832', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
            Devnet
          </span>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500, whiteSpace: 'nowrap' }}>Program ID</span>

          <code style={{
            flex: 1, fontFamily: 'var(--mono)', fontSize: '0.82rem',
            color: 'var(--text)', letterSpacing: '0.01em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            minWidth: 0,
          }}>
            {PROGRAM_ID}
          </code>

          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <motion.button
              onClick={copy}
              whileHover={{ color: 'var(--green)' }}
              whileTap={{ scale: 0.92 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.7rem', borderRadius: 7,
                border: '1px solid var(--border)',
                fontSize: '0.75rem', fontWeight: 500,
                color: copied ? 'var(--green)' : 'var(--text-dim)',
                transition: 'color 0.15s',
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </motion.button>

            <motion.a
              href={EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ borderColor: 'var(--purple)', color: 'var(--purple)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.7rem', borderRadius: 7,
                border: '1px solid var(--border)',
                fontSize: '0.75rem', fontWeight: 500,
                color: 'var(--text-dim)',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              <ExplorerIcon />
              Open Explorer
            </motion.a>
          </div>
        </motion.div>

        {/* Explorer links grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}
        >
          {LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -3, boxShadow: `0 0 28px ${link.bg}` }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.1rem 1.25rem',
                background: link.bg,
                border: `1px solid ${link.border}`,
                borderRadius: 'var(--radius)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: 'rgba(0,0,0,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: link.color,
              }}>
                {link.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>{link.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{link.sub}</div>
              </div>
              <ArrowIcon style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--text-faint)' }} />
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

function ProgramIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-5"/></svg>
}
function TxIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
}
function IdlIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
}
function CopyIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
}
function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
}
function ExplorerIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
function ArrowIcon({ style }: { style?: React.CSSProperties }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
}
