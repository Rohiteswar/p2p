import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface OrderEntry {
  id: number
  price: number
  qty: number
  remaining: number
  type: number
  side: 'bid' | 'ask'
  ts: number
}

interface EventEntry {
  id: number
  type: 'placed' | 'filled' | 'cancelled' | 'market'
  msg: string
  sub: string
}

const ORDER_TYPES = ['Limit', 'IOC', 'FOK', 'Post-Only']

export default function Simulation() {
  const nextId  = useRef(1)
  const nextEvt = useRef(1)
  const [asks, setAsks] = useState<OrderEntry[]>([])
  const [bids, setBids] = useState<OrderEntry[]>([])
  const [events, setEvents] = useState<EventEntry[]>([])
  const [side, setSide] = useState<'bid' | 'ask'>('bid')
  const [price, setPrice] = useState('100000')
  const [qty, setQty] = useState('5')
  const [orderType, setOrderType] = useState('0')

  const addEvent = useCallback((type: EventEntry['type'], msg: string, sub: string) => {
    setEvents(ev => [{ id: nextEvt.current++, type, msg, sub }, ...ev].slice(0, 18))
  }, [])

  const placeOrder = useCallback(() => {
    const p = parseInt(price), q = parseInt(qty), t = parseInt(orderType)
    if (!p || p <= 0 || !q || q <= 0) return

    const order: OrderEntry = { id: nextId.current++, price: p, qty: q, remaining: q, type: t, side, ts: Date.now() }

    let asksSnap = [...asks]
    let bidsSnap = [...bids]

    if (side === 'ask') {
      asksSnap = [...asksSnap, order].sort((a, b) => a.price - b.price)
    } else {
      bidsSnap = [...bidsSnap, order].sort((a, b) => b.price - a.price)
    }

    addEvent('placed', `${side.toUpperCase()} #${order.id}`, `${q} lots @ ${p.toLocaleString()} · ${ORDER_TYPES[t]}`)

    if (t === 1 || t === 2) {
      const opp = side === 'bid' ? asksSnap : bidsSnap
      let rem = q
      const filled: number[] = []
      for (const resting of opp) {
        if (rem === 0) break
        const canFill = side === 'bid' ? p >= resting.price : p <= resting.price
        if (!canFill) break
        const fq = Math.min(rem, resting.remaining)
        rem -= fq
        resting.remaining -= fq
        addEvent('filled', `Fill #${resting.id} ← #${order.id}`, `${fq} lots @ ${resting.price.toLocaleString()}`)
        if (resting.remaining === 0) filled.push(resting.id)
      }
      if (t === 1 && rem < q) {
        if (rem > 0) addEvent('cancelled', `IOC #${order.id} cancelled`, `${rem} lots unfilled`)
      } else if (t === 2 && rem > 0) {
        addEvent('cancelled', `FOK #${order.id} cancelled`, 'No full fill available')
        if (side === 'ask') asksSnap.pop(); else bidsSnap.pop()
      }
      if (side === 'bid') {
        setAsks(asksSnap.filter(o => !filled.includes(o.id)))
        setBids(bidsSnap.filter(o => o.id !== order.id || rem === 0))
      } else {
        setBids(bidsSnap.filter(o => !filled.includes(o.id)))
        setAsks(asksSnap.filter(o => o.id !== order.id || rem === 0))
      }
    } else {
      setAsks(asksSnap)
      setBids(bidsSnap)
    }
  }, [price, qty, orderType, side, asks, bids, addEvent])

  const fillTop = useCallback(() => {
    const src = asks.length > 0 ? asks : bids
    if (src.length === 0) return
    const [top, ...rest] = src
    const fq = Math.max(1, Math.floor(top.remaining / 2))
    const newRem = top.remaining - fq
    addEvent('filled', `Fill #${top.id}`, `${fq} lots @ ${top.price.toLocaleString()}`)
    if (newRem === 0) {
      if (asks.length > 0) setAsks(rest); else setBids(rest)
    } else {
      const updated = { ...top, remaining: newRem }
      if (asks.length > 0) setAsks([updated, ...rest]); else setBids([updated, ...rest])
    }
  }, [asks, bids, addEvent])

  const cancelTop = useCallback(() => {
    const srcAsk = asks.length > 0
    const [top, ...rest] = srcAsk ? asks : bids
    if (!top) return
    addEvent('cancelled', `Cancel #${top.id}`, `${top.remaining} lots returned`)
    if (srcAsk) setAsks(rest); else setBids(rest)
  }, [asks, bids, addEvent])

  const loadSample = useCallback(() => {
    const base = 100_000
    const newAsks: OrderEntry[] = [5,4,3,2,1].map((off, i) => ({
      id: nextId.current++, price: base + off * 1000,
      qty: 3 + i, remaining: 3 + i, type: 0, side: 'ask', ts: Date.now(),
    }))
    const newBids: OrderEntry[] = [1,2,3,4,5].map((off, i) => ({
      id: nextId.current++, price: base - off * 1000,
      qty: 2 + i, remaining: 2 + i, type: 0, side: 'bid', ts: Date.now(),
    }))
    setAsks(newAsks.sort((a, b) => a.price - b.price))
    setBids(newBids.sort((a, b) => b.price - a.price))
    addEvent('market', 'Sample book loaded', '5 asks + 5 bids')
  }, [addEvent])

  const maxQty = Math.max(...asks.map(o => o.remaining), ...bids.map(o => o.remaining), 1)
  const bestAsk = asks[0]?.price
  const bestBid = bids[0]?.price
  const spread  = bestAsk && bestBid ? bestAsk - bestBid : null

  return (
    <section id="playground" style={{ padding: '7rem 2rem', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '0.75rem' }}>
            Playground
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            Try it without a wallet
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', maxWidth: 520, marginBottom: '2.5rem' }}>
            Simulate the full protocol flow in your browser — place orders, fill, cancel. See exactly how the mechanics work before integrating.
          </p>
        </motion.div>

        {/* Market bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
            padding: '1rem 1.5rem', borderRadius: 'var(--radius)',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            marginBottom: '1.25rem',
          }}
        >
          {[
            { l: 'Pair', v: 'BASE / QUOTE', c: undefined },
            { l: 'Best Ask', v: bestAsk ? bestAsk.toLocaleString() : '—', c: 'var(--red)' },
            { l: 'Best Bid', v: bestBid ? bestBid.toLocaleString() : '—', c: 'var(--green)' },
            { l: 'Spread',   v: spread ? `${spread.toLocaleString()} ticks` : '—', c: 'var(--purple)' },
            { l: 'Orders',   v: String(asks.length + bids.length), c: undefined },
            { l: 'Tick Size',v: '1,000', c: undefined },
          ].map(({ l, v, c }) => (
            <div key={l}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.15rem' }}>{l}</div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '0.85rem', color: c }}>{v}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: '270px 1fr 290px', gap: '1.1rem', alignItems: 'start' }}
        >
          {/* Order form */}
          <Panel label="Place Order" tag="Simulation">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {(['bid', 'ask'] as const).map(s => (
                <motion.button
                  key={s}
                  onClick={() => setSide(s)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1, padding: '0.45rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
                    border: `1px solid ${side === s ? (s === 'bid' ? 'var(--green)' : 'var(--red)') : 'var(--border)'}`,
                    background: side === s
                      ? s === 'bid' ? 'rgba(20,241,149,0.1)' : 'rgba(255,77,106,0.1)'
                      : 'transparent',
                    color: side === s
                      ? s === 'bid' ? 'var(--green)' : 'var(--red)'
                      : 'var(--text-dim)',
                    transition: 'all 0.15s',
                  }}
                >
                  {s === 'bid' ? 'BID (Buy)' : 'ASK (Sell)'}
                </motion.button>
              ))}
            </div>

            {[
              { label: 'Price (ticks)', val: price, set: setPrice, step: 1000, min: 1 },
              { label: 'Quantity (lots)', val: qty, set: setQty, step: 1, min: 1 },
            ].map(({ label, val, set, step, min }) => (
              <div key={label} style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-dim)', marginBottom: '0.3rem' }}>{label}</label>
                <Stepper value={val} onChange={set} step={step} min={min} />
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Order Type</label>
              <Dropdown value={orderType} onChange={setOrderType} options={ORDER_TYPES} />
            </div>

            <motion.button
              onClick={placeOrder}
              whileHover={{ filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', padding: '0.65rem', borderRadius: 8,
                background: side === 'bid' ? 'var(--green-dim)' : 'var(--red-dim)',
                color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                marginBottom: '0.75rem',
              }}
            >
              Place {side === 'bid' ? 'Bid' : 'Ask'}
            </motion.button>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Load sample', fn: loadSample },
                { label: 'Fill best',  fn: fillTop },
                { label: 'Cancel top', fn: cancelTop },
              ].map(({ label, fn }) => (
                <motion.button
                  key={label}
                  onClick={fn}
                  whileHover={{ borderColor: 'var(--border2)', color: 'var(--text)' }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '0.3rem 0.7rem', borderRadius: 6,
                    border: '1px solid var(--border)',
                    fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-dim)',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </Panel>

          {/* Orderbook */}
          <Panel label="Orderbook" tag="Price / Qty / Total">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.3rem 0.75rem', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)' }}>
              <span>Price</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {/* Asks */}
            <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
              <AnimatePresence initial={false}>
                {asks.slice(0, 8).map(o => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.28rem 0.75rem', fontSize: '0.8rem', fontFamily: 'var(--mono)', color: 'var(--red)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(o.remaining / maxQty) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: 'rgba(255,77,106,0.07)' }}
                    />
                    <span style={{ position: 'relative' }}>{o.price.toLocaleString()}</span>
                    <span style={{ position: 'relative', textAlign: 'center', color: 'var(--text-dim)' }}>{o.remaining}</span>
                    <span style={{ position: 'relative', textAlign: 'right' }}>{(o.price * o.remaining).toLocaleString()}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Spread */}
            <div style={{ padding: '0.4rem 0.75rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', fontFamily: 'var(--mono)' }}>
              {spread != null
                ? <span>Spread: <span style={{ color: 'var(--purple)', fontWeight: 600 }}>{spread.toLocaleString()} ticks</span></span>
                : <span style={{ color: 'var(--text-faint)' }}>Place some orders to see the spread</span>
              }
            </div>

            {/* Bids */}
            <div style={{ maxHeight: 180, overflowY: 'auto' }}>
              <AnimatePresence initial={false}>
                {bids.slice(0, 8).map(o => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.28rem 0.75rem', fontSize: '0.8rem', fontFamily: 'var(--mono)', color: 'var(--green)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(o.remaining / maxQty) * 100}%` }}
                      transition={{ duration: 0.4 }}
                      style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: 'rgba(20,241,149,0.07)' }}
                    />
                    <span style={{ position: 'relative' }}>{o.price.toLocaleString()}</span>
                    <span style={{ position: 'relative', textAlign: 'center', color: 'var(--text-dim)' }}>{o.remaining}</span>
                    <span style={{ position: 'relative', textAlign: 'right' }}>{(o.price * o.remaining).toLocaleString()}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {asks.length === 0 && bids.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                No orders yet — place some or load the sample book
              </div>
            )}
          </Panel>

          {/* Event log */}
          <Panel label="Event Log" tag={
            <button
              onClick={() => setEvents([])}
              style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: 5, border: '1px solid var(--border)', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              Clear
            </button>
          }>
            <div style={{ maxHeight: 440, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <AnimatePresence initial={false}>
                {events.map(ev => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      padding: '0.6rem 0.75rem', borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--surface2)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                      marginBottom: '0.25rem',
                      color: ev.type === 'placed' ? 'var(--purple)' : ev.type === 'filled' ? 'var(--green)' : ev.type === 'cancelled' ? '#ffc832' : '#3296ff',
                    }}>
                      {ev.type === 'placed' ? 'OrderPlaced' : ev.type === 'filled' ? 'OrderFilled' : ev.type === 'cancelled' ? 'OrderCancelled' : 'MarketEvent'}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'var(--mono)', fontWeight: 500, marginBottom: '0.1rem' }}>{ev.msg}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{ev.sub}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                  Events will appear here as you interact
                </div>
              )}
            </div>
          </Panel>
        </motion.div>
      </div>
    </section>
  )
}

function Stepper({ value, onChange, step, min }: { value: string; onChange: (v: string) => void; step: number; min: number }) {
  const [focused, setFocused] = useState(false)
  const n = parseInt(value) || 0

  function increment() { onChange(String(Math.max(min, n + step))) }
  function decrement() { onChange(String(Math.max(min, n - step))) }

  return (
    <div style={{
      display: 'flex',
      background: 'var(--surface2)',
      border: `1px solid ${focused ? 'var(--border2)' : 'var(--border)'}`,
      borderRadius: 6,
      overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      <motion.button
        onTap={decrement}
        whileTap={{ scale: 0.85 }}
        style={{
          width: 34, flexShrink: 0, alignSelf: 'stretch',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-dim)',
          borderRight: '1px solid var(--border)',
          transition: 'color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface3)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor" style={{ display: 'block' }}><rect width="12" height="2" rx="1"/></svg>
      </motion.button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, padding: '0.5rem',
          background: 'transparent', border: 'none',
          color: 'var(--text)', fontSize: '0.85rem',
          fontFamily: 'var(--mono)', outline: 'none',
          textAlign: 'center', minWidth: 0,
        }}
      />
      <motion.button
        onTap={increment}
        whileTap={{ scale: 0.85 }}
        style={{
          width: 34, flexShrink: 0, alignSelf: 'stretch',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-dim)',
          borderLeft: '1px solid var(--border)',
          transition: 'color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface3)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ display: 'block' }}><rect x="5" y="0" width="2" height="12" rx="1"/><rect x="0" y="5" width="12" height="2" rx="1"/></svg>
      </motion.button>
    </div>
  )
}

function Dropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedLabel = options[parseInt(value)] ?? options[0]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%', padding: '0.45rem 0.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface2)',
          border: `1px solid ${open ? 'var(--border2)' : 'var(--border)'}`,
          borderRadius: open ? '6px 6px 0 0' : 6,
          color: 'var(--text)', fontSize: '0.85rem',
          fontFamily: 'var(--mono)',
          transition: 'border-color 0.15s',
          height: 36,
        }}
      >
        <span>{selectedLabel}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', color: 'var(--text-dim)', flexShrink: 0 }}
        >
          <ChevronIcon />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: 'var(--surface2)',
              border: '1px solid var(--border2)',
              borderTop: 'none',
              borderRadius: '0 0 6px 6px',
              overflow: 'hidden',
            }}
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                onClick={() => { onChange(String(i)); setOpen(false) }}
                whileHover={{ background: 'var(--surface3)' }}
                style={{
                  width: '100%', padding: '0.45rem 0.75rem',
                  textAlign: 'left', fontSize: '0.85rem',
                  fontFamily: 'var(--mono)',
                  color: String(i) === value ? 'var(--purple)' : 'var(--text)',
                  background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.1s',
                }}
              >
                {opt}
                {String(i) === value && <CheckMark />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChevronIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
}
function CheckMark() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
}

function Panel({ label, tag, children }: { label: string; tag: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{
        padding: '0.7rem 1rem', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--text-dim)',
      }}>
        <span>{label}</span>
        <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, fontSize: '0.68rem', color: 'var(--text-faint)' }}>{tag}</span>
      </div>
      <div style={{ padding: '1rem' }}>{children}</div>
    </div>
  )
}
