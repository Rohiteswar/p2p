import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { api, ApiEvent, EVENT_TYPE_NAMES } from '../lib/api'

const TYPE_COLOR: Record<number, string> = {
  1: 'var(--purple)',
  2: 'var(--green)',
  3: '#ffc832',
  4: 'var(--text-dim)',
  5: '#3296ff',
}

function truncate(s: string, n = 8) {
  return s.length <= n * 2 + 3 ? s : `${s.slice(0, n)}…${s.slice(-n)}`
}

function ago(ts: number) {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 60)  return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export default function LiveFeed() {
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [error,  setError]  = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const data = await api.events(20)
        if (mounted) { setEvents(data); setError(false) }
      } catch {
        if (mounted) setError(true)
      }
    }

    load()
    const id = setInterval(load, 10_000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  if (error || events.length === 0) return null

  return (
    <section className="section-md" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="page-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '0.4rem' }}>
                Live
              </div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
                Recent Events
              </h2>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--green)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-dot 2s infinite', display: 'inline-block' }} />
              Live · refreshes every 10s
            </div>
          </div>

          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px',
              padding: '0.55rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-faint)',
            }}>
              <span>Event</span>
              <span>Market</span>
              <span>Tx</span>
              <span style={{ textAlign: 'right' }}>Time</span>
            </div>

            <AnimatePresence initial={false}>
              {events.map(ev => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px',
                    padding: '0.65rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: TYPE_COLOR[ev.event_type] ?? 'var(--text-dim)',
                  }}>
                    {EVENT_TYPE_NAMES[ev.event_type] ?? `evt_${ev.event_type}`}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {ev.market ? truncate(ev.market) : '—'}
                  </span>
                  <a
                    href={`https://explorer.solana.com/tx/${ev.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--purple)', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  >
                    {truncate(ev.signature)}
                  </a>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textAlign: 'right' }}>
                    {ago(ev.timestamp)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
