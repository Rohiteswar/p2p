import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'

const NAV_LINKS = ['Features', 'Playground', 'Quickstart']

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,7,14,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
      }}
    >
      <div className="nav-inner">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
          <Hexagon />
          P2P Protocol
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map((label, i) => (
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.4 }}
          >
            <Link
              to="/api-tester"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.28rem 0.75rem', borderRadius: 7,
                background: 'rgba(153,69,255,0.1)',
                border: '1px solid rgba(153,69,255,0.28)',
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--purple)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(153,69,255,0.18)'; el.style.borderColor = 'rgba(153,69,255,0.5)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(153,69,255,0.1)'; el.style.borderColor = 'rgba(153,69,255,0.28)' }}
            >
              <TerminalIcon />
              API Tester
            </Link>
          </motion.div>

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

        {/* Mobile hamburger */}
        <div ref={menuRef} className="nav-hamburger" style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ color: 'var(--text-dim)', padding: '0.4rem', display: 'flex', alignItems: 'center' }}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 0.75rem)', right: 0,
                  background: 'rgba(13,13,22,0.97)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border2)',
                  borderRadius: 12,
                  padding: '0.5rem',
                  minWidth: 180,
                  display: 'flex', flexDirection: 'column', gap: '0.1rem',
                }}
              >
                {NAV_LINKS.map((label) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: 8,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--text-dim)',
                      transition: 'color 0.15s, background 0.15s',
                      display: 'block',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text)'; el.style.background = 'var(--surface2)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-dim)'; el.style.background = 'transparent'; }}
                  >
                    {label}
                  </a>
                ))}
                <Link
                  to="/api-tester"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--purple)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; }}
                >
                  <TerminalIcon />
                  API Tester
                </Link>
                <div style={{
                  margin: '0.4rem 1rem 0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.72rem', fontWeight: 600, color: '#ffc832',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffc832', animation: 'pulse-dot 2s infinite' }} />
                  Live on Devnet
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
