import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: 60,
        background: scrolled ? 'rgba(7,7,14,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
        <Hexagon />
        P2P Protocol
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        {['Features', 'Playground', 'Quickstart'].map((label, i) => (
          <motion.a
            key={label}
            href={`#${label.toLowerCase()}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            whileHover={{ color: '#e4e4f0' }}
            style={{ fontSize: '0.875rem', color: 'var(--text-dim)', transition: 'color 0.15s' }}
          >
            {label}
          </motion.a>
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.75rem', borderRadius: 99,
            background: 'rgba(255,200,50,0.08)',
            border: '1px solid rgba(255,200,50,0.22)',
            fontSize: '0.72rem', fontWeight: 600, color: '#ffc832',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffc832', animation: 'pulse-dot 2s infinite' }} />
          Devnet
        </motion.div>
      </div>
    </motion.nav>
  )
}

function Hexagon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 2L23 7.5V18.5L13 24L3 18.5V7.5L13 2Z" stroke="#9945ff" strokeWidth="1.5" fill="none" />
      <path d="M13 8L18 10.75V16.25L13 19L8 16.25V10.75L13 8Z" fill="#9945ff" opacity=".35" />
      <circle cx="13" cy="13" r="2.5" fill="#14f195" />
    </svg>
  )
}
