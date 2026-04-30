import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const WORDS = ['Peer-to-Peer', 'Limit Orders', 'on Solana.']

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 })
  const glowX = useTransform(springX, [0, 1], ['-20%', '120%'])
  const glowY = useTransform(springY, [0, 1], ['-20%', '120%'])

  function handleMouse(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  function copyNpm() {
    navigator.clipboard.writeText('npm install @p2p-protocol/sdk').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouse}
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '8rem 2rem 6rem', overflow: 'hidden',
      }}
    >
      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Drifting gradient orbs */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '20%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(153,69,255,0.12), transparent 70%)',
          animation: 'drift 18s ease-in-out infinite',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,241,149,0.07), transparent 70%)',
          animation: 'drift2 14s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Mouse-follow glow */}
      <motion.div
        style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%', zIndex: 0,
          background: 'radial-gradient(circle, rgba(153,69,255,0.1), transparent 70%)',
          pointerEvents: 'none', filter: 'blur(80px)',
          left: glowX, top: glowY,
          translateX: '-50%', translateY: '-50%',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Devnet badge */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.3rem 1rem', borderRadius: 99,
            border: '1px solid rgba(255,200,50,0.25)',
            background: 'rgba(255,200,50,0.06)',
            fontSize: '0.75rem', fontWeight: 600, color: '#ffc832',
            marginBottom: '2rem',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffc832', animation: 'pulse-dot 2s infinite' }} />
          Live on Solana Devnet
        </motion.div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'block',
                background: i === 1
                  ? 'linear-gradient(135deg, #9945ff, #14f195)'
                  : undefined,
                WebkitBackgroundClip: i === 1 ? 'text' : undefined,
                WebkitTextFillColor: i === 1 ? 'transparent' : undefined,
                backgroundClip: i === 1 ? 'text' : undefined,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{ fontSize: '1.1rem', color: 'var(--text-dim)', maxWidth: 500, marginBottom: '2.5rem', lineHeight: 1.7 }}
        >
          A fully on-chain orderbook protocol. No AMM slippage, no intermediaries.
          Your keys, your trades — settled directly on-chain.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}
        >
          <motion.a
            href="#playground"
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(153,69,255,0.35)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.5rem', borderRadius: 10,
              background: 'var(--purple)', color: '#fff',
              fontWeight: 600, fontSize: '0.9rem',
              transition: 'background 0.15s',
            }}
          >
            <PlayIcon />
            Try Playground
          </motion.a>
          <motion.a
            href="#quickstart"
            whileHover={{ scale: 1.03, borderColor: 'var(--purple)', color: 'var(--purple)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.5rem', borderRadius: 10,
              border: '1px solid var(--border2)', color: 'var(--text)',
              fontWeight: 600, fontSize: '0.9rem',
              transition: 'all 0.15s',
            }}
          >
            <CodeIcon />
            View SDK
          </motion.a>
        </motion.div>

        {/* npm install bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center',
            border: '1px solid var(--border2)', borderRadius: 10,
            background: 'var(--surface)', overflow: 'hidden',
            maxWidth: 440, width: '100%',
          }}
        >
          <span style={{
            padding: '0.6rem 1rem', background: 'var(--surface2)',
            borderRight: '1px solid var(--border)',
            fontSize: '0.75rem', color: 'var(--text-dim)',
            fontFamily: 'var(--mono)', whiteSpace: 'nowrap',
          }}>
            npm
          </span>
          <span style={{
            flex: 1, padding: '0.6rem 1rem',
            fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--green)',
          }}>
            install @p2p-protocol/sdk
          </span>
          <motion.button
            onClick={copyNpm}
            whileHover={{ color: 'var(--green)' }}
            whileTap={{ scale: 0.9 }}
            style={{ padding: '0.6rem 0.9rem', color: copied ? 'var(--green)' : 'var(--text-dim)', transition: 'color 0.15s' }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{ display: 'flex', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { v: '<5K', l: 'CU per ix' },
            { v: '5', l: 'Instructions' },
            { v: '116B', l: 'Order account' },
            { v: '0', l: 'Off-chain deps' },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #9945ff, #14f195)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{v}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PlayIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
}
function CodeIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
}
function CopyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
}
