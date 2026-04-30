import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Token = { t: string; v: string }
type Line  = Token[]

const TABS = [
  { label: 'Install',       id: 'install' },
  { label: 'Create Market', id: 'create'  },
  { label: 'Place Order',   id: 'place'   },
  { label: 'Fill Order',    id: 'fill'    },
]

const kw  = (v: string): Token => ({ t: 'kw',    v })
const fn_  = (v: string): Token => ({ t: 'fn',    v })
const str = (v: string): Token => ({ t: 'str',   v })
const num = (v: string): Token => ({ t: 'num',   v })
const cm  = (v: string): Token => ({ t: 'cm',    v })
const pr  = (v: string): Token => ({ t: 'prop',  v })
const pl  = (v: string): Token => ({ t: 'plain', v })

const CODE: Record<string, Line[]> = {
  install: [
    [cm('# Install the SDK')],
    [pl('npm install @p2p-protocol/sdk')],
    [],
    [cm('# Peer dependencies')],
    [pl('npm install @solana/web3.js @solana/spl-token')],
  ],
  create: [
    [kw('import'), pl(' { Connection, Keypair, sendAndConfirmTransaction } '), kw('from'), pl(' '), str("'@solana/web3.js'"), pl(';')],
    [kw('import'), pl(' { P2PClient } '), kw('from'), pl(' '), str("'@p2p-protocol/sdk'"), pl(';')],
    [],
    [kw('const'), pl(' connection = '), kw('new'), pl(' '), fn_('Connection'), pl('('), str("'https://api.devnet.solana.com'"), pl(');')],
    [kw('const'), pl(' client = '), kw('new'), pl(' '), fn_('P2PClient'), pl('(connection);')],
    [],
    [kw('const'), pl(' tx = '), kw('await'), pl(' client.'), fn_('createMarket'), pl('({')],
    [pl('  payer,')],
    [pl('  baseMint,')],
    [pl('  quoteMint,')],
    [pl('  takerFeeBps:    '), num('10'), pl(',')],
    [pl('  makerRebateBps: '), num('5'),  pl(',')],
    [pl('});')],
    [],
    [kw('await'), pl(' '), fn_('sendAndConfirmTransaction'), pl('(connection, tx, [payer]);')],
  ],
  place: [
    [kw('import'), pl(' { OrderSide, OrderType } '), kw('from'), pl(' '), str("'@p2p-protocol/sdk'"), pl(';')],
    [],
    [kw('const'), pl(' tx = '), kw('await'), pl(' client.'), fn_('placeOrder'), pl('({')],
    [pl('  market,')],
    [pl('  owner,')],
    [pl('  side:      OrderSide.'),  pr('Bid'),      pl(',')],
    [pl('  orderType: OrderType.'),  pr('Limit'),    pl(',')],
    [pl('  price:    '), num('1_000_000'), pl(',')],
    [pl('  quantity: '), num('500_000'),   pl(',')],
    [pl('  clientOrderId: '), num('1n'),   pl(',')],
    [pl('});')],
    [],
    [kw('await'), pl(' '), fn_('sendAndConfirmTransaction'), pl('(connection, tx, [owner]);')],
  ],
  fill: [
    [kw('import'), pl(' { deriveOrderAddress } '), kw('from'), pl(' '), str("'@p2p-protocol/sdk'"), pl(';')],
    [],
    [kw('const'), pl(' orderAddress = '), fn_('deriveOrderAddress'), pl('(')],
    [pl('  market,')],
    [pl('  owner.'), pr('publicKey'), pl(',')],
    [pl('  clientOrderId,')],
    [pl(');')],
    [],
    [kw('const'), pl(' tx = '), kw('await'), pl(' client.'), fn_('fillOrder'), pl('({')],
    [pl('  market,')],
    [pl('  taker,')],
    [pl('  order: orderAddress,')],
    [pl('  fillQuantity: '), num('250_000'), pl(',')],
    [pl('});')],
    [],
    [kw('await'), pl(' '), fn_('sendAndConfirmTransaction'), pl('(connection, tx, [taker]);')],
  ],
}

const COLOR: Record<string, string> = {
  kw:    '#c792ea',
  fn:    '#79c0ff',
  str:   '#c3e88d',
  num:   '#f0883e',
  cm:    'var(--text-faint)',
  prop:  '#e3b341',
  plain: 'var(--text)',
}

function codeToString(lines: Line[]) {
  return lines.map(l => l.map(t => t.v).join('')).join('\n')
}

export default function Quickstart() {
  const [active, setActive]   = useState('install')
  const [copied, setCopied]   = useState(false)

  function copy() {
    navigator.clipboard.writeText(codeToString(CODE[active])).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <section id="quickstart" style={{ padding: '7rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '0.75rem' }}>
            SDK
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            Integrate in minutes
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', maxWidth: 480, marginBottom: '2.75rem', lineHeight: 1.7 }}>
            Full TypeScript SDK with PDA derivation, instruction builders, and event decoding — all typed end-to-end.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)',
            overflow: 'hidden',
          }}
        >
          {/* Tab bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            padding: '0 0.25rem',
          }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  position: 'relative',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.82rem', fontWeight: 600,
                  color: active === tab.id ? 'var(--text)' : 'var(--text-dim)',
                  transition: 'color 0.15s',
                }}
              >
                {tab.label}
                {active === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 2, background: 'var(--purple)',
                      borderRadius: '2px 2px 0 0',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{ position: 'relative' }}
            >
              <pre style={{
                margin: 0,
                padding: '1.6rem 1.75rem',
                fontFamily: 'var(--mono)',
                fontSize: '0.82rem',
                lineHeight: 1.8,
                overflowX: 'auto',
                color: 'var(--text)',
              }}>
                {CODE[active].map((line, li) => (
                  <div key={li} style={{ minHeight: '1.4em' }}>
                    {line.map((tok, ti) => (
                      <span key={ti} style={{ color: COLOR[tok.t] ?? 'var(--text)' }}>{tok.v}</span>
                    ))}
                  </div>
                ))}
              </pre>

              <motion.button
                onClick={copy}
                whileHover={{ color: 'var(--green)' }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  color: copied ? 'var(--green)' : 'var(--text-dim)',
                  fontSize: '0.75rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  transition: 'color 0.15s',
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
        >
          {[
            { label: 'npm registry', href: 'https://www.npmjs.com/package/@p2p-protocol/sdk', icon: <NpmIcon /> },
            { label: 'GitHub',       href: 'https://github.com/Rohiteswar/p2p-protocol-sdk',  icon: <GithubIcon /> },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.8rem', color: 'var(--text-dim)',
                border: '1px solid var(--border)', borderRadius: 8,
                padding: '0.45rem 0.9rem',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text)'; el.style.borderColor = 'var(--border2)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-dim)'; el.style.borderColor = 'var(--border)'; }}
            >
              {icon} {label}
            </a>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

function CopyIcon()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> }
function CheckIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> }
function NpmIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/></svg> }
function GithubIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> }
