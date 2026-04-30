import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'

/* ── Types ─────────────────────────────────────────────────────────────── */
type Method  = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ParamIn = 'path' | 'query' | 'body'

interface EndpointParam {
  name        : string
  in          : ParamIn
  type        : 'string' | 'integer' | 'boolean' | 'json'
  required    : boolean
  description : string
  default?    : string
  example?    : string
  enum?       : string[]
}

interface Preset {
  label       : string
  method      : Method
  path        : string
  description : string
  returns     : string
  params      : EndpointParam[]
}

interface PresetGroup {
  group    : string
  endpoints: Preset[]
}

interface KVRow { key: string; value: string; enabled: boolean }

/* ── Endpoint definitions ───────────────────────────────────────────────── */
const PRESETS: PresetGroup[] = [
  {
    group: 'System',
    endpoints: [
      {
        label: 'Health', method: 'GET', path: '/health',
        description: 'Check whether the API service is up and connected to the database.',
        returns: '{ status: "ok" }',
        params: [],
      },
      {
        label: 'Stats', method: 'GET', path: '/stats',
        description: 'Global aggregate statistics for the P2P Protocol — market count, open orders, total fills, and cumulative volume.',
        returns: 'Stats object',
        params: [],
      },
    ],
  },
  {
    group: 'Markets',
    endpoints: [
      {
        label: 'List Markets', method: 'GET', path: '/markets',
        description: 'Returns all on-chain markets indexed by the P2P Protocol indexer, ordered by creation time (newest first).',
        returns: 'Array of Market objects',
        params: [
          { name: 'limit',  in: 'query', type: 'integer', required: false, description: 'Max number of markets to return.',          default: '50',  example: '20'  },
          { name: 'offset', in: 'query', type: 'integer', required: false, description: 'Number of markets to skip (for pagination).', default: '0',   example: '0'   },
        ],
      },
      {
        label: 'Get Market', method: 'GET', path: '/markets/{address}',
        description: 'Fetch a single market by its Solana account address, including the full live order book (bids and asks).',
        returns: 'MarketDetail { market, asks[], bids[] }',
        params: [
          { name: 'address', in: 'path', type: 'string', required: true, description: 'Base58-encoded Solana public key of the market account.', example: 'HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18' },
        ],
      },
      {
        label: 'Market Orders', method: 'GET', path: '/markets/{address}/orders',
        description: 'All open orders for a specific market, sorted by price descending.',
        returns: 'Array of Order objects',
        params: [
          { name: 'address', in: 'path',  type: 'string',  required: true,  description: 'Base58-encoded public key of the market.',        example: 'HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18' },
          { name: 'side',    in: 'query', type: 'string',  required: false, description: 'Filter by side.',  enum: ['buy', 'sell']           },
          { name: 'limit',   in: 'query', type: 'integer', required: false, description: 'Max results.',     default: '50', example: '50'   },
        ],
      },
      {
        label: 'Market Events', method: 'GET', path: '/markets/{address}/events',
        description: 'Recent on-chain events emitted by a specific market (OrderPlaced, OrderFilled, OrderCancelled, etc.).',
        returns: 'Array of ApiEvent objects',
        params: [
          { name: 'address', in: 'path',  type: 'string',  required: true,  description: 'Base58-encoded public key of the market.', example: 'HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18' },
          { name: 'limit',   in: 'query', type: 'integer', required: false, description: 'Max events to return.',  default: '20', example: '20' },
        ],
      },
    ],
  },
  {
    group: 'Orders',
    endpoints: [
      {
        label: 'Get Order', method: 'GET', path: '/orders/{address}',
        description: 'Fetch a single order account by its Solana address, including current fill status and quantities.',
        returns: 'Order object',
        params: [
          { name: 'address', in: 'path', type: 'string', required: true, description: 'Base58-encoded public key of the order account.', example: 'HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18' },
        ],
      },
    ],
  },
  {
    group: 'Events',
    endpoints: [
      {
        label: 'Global Events', method: 'GET', path: '/events',
        description: 'Most recent program events across all markets — useful for building a global activity feed or monitoring the protocol.',
        returns: 'Array of ApiEvent objects',
        params: [
          { name: 'limit',      in: 'query', type: 'integer', required: false, description: 'Max number of events to return.',    default: '20',  example: '20'   },
          { name: 'event_type', in: 'query', type: 'integer', required: false, description: 'Filter by event type (1–5).',        example: '2'    },
          { name: 'market',     in: 'query', type: 'string',  required: false, description: 'Filter by market address (base58).',              },
        ],
      },
    ],
  },
]

const METHOD_COLORS: Record<Method, string> = {
  GET:    '#14f195',
  POST:   '#9945ff',
  PUT:    '#ffc832',
  DELETE: '#ff4d6a',
}

const METHOD_BG: Record<Method, string> = {
  GET:    'rgba(20,241,149,0.08)',
  POST:   'rgba(153,69,255,0.08)',
  PUT:    'rgba(255,200,50,0.08)',
  DELETE: 'rgba(255,77,106,0.08)',
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function ApiTester() {
  const BASE = import.meta.env.VITE_API_URL || '/api'

  const [activePreset,  setActivePreset]  = useState<Preset | null>(null)
  const [method,        setMethod]        = useState<Method>('GET')
  const [url,           setUrl]           = useState(BASE + '/stats')
  const [paramValues,   setParamValues]   = useState<Record<string, string>>({})
  const [activeTab,     setActiveTab]     = useState<'parameters' | 'headers' | 'body'>('parameters')
  const [headers,       setHeaders]       = useState<KVRow[]>([
    { key: 'Accept', value: 'application/json', enabled: true },
    { key: '', value: '', enabled: true },
  ])
  const [body,          setBody]          = useState('')
  const [response,      setResponse]      = useState<string | null>(null)
  const [status,        setStatus]        = useState<number | null>(null)
  const [elapsed,       setElapsed]       = useState<number | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [sidebarOpen,   setSidebarOpen]   = useState(true)

  const abortRef = useRef<AbortController | null>(null)

  /* ── Recompute URL when params change ───────────────────────────────── */
  useEffect(() => {
    if (!activePreset) return
    let path = activePreset.path

    // Fill path params
    path = path.replace(/\{(\w+)\}/g, (_, name) => paramValues[name] || `{${name}}`)

    // Build query string from query params
    const qs = activePreset.params
      .filter(p => p.in === 'query' && (paramValues[p.name] ?? p.default ?? '') !== '')
      .map(p => `${p.name}=${encodeURIComponent(paramValues[p.name] ?? p.default ?? '')}`)
      .join('&')

    setUrl(BASE + path + (qs ? `?${qs}` : ''))
  }, [paramValues, activePreset, BASE])

  /* ── Load preset ────────────────────────────────────────────────────── */
  function loadPreset(p: Preset) {
    setActivePreset(p)
    setMethod(p.method)
    setActiveTab('parameters')
    setResponse(null)
    setStatus(null)
    setElapsed(null)
    setError(null)
    setBody('')

    // Seed default values
    const defaults: Record<string, string> = {}
    p.params.forEach(param => {
      if (param.default) defaults[param.name] = param.default
    })
    setParamValues(defaults)
  }

  /* ── Send request ───────────────────────────────────────────────────── */
  async function sendRequest() {
    setLoading(true)
    setError(null)
    setResponse(null)
    setStatus(null)
    setElapsed(null)

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const hdrs: Record<string, string> = {}
      headers.filter(h => h.enabled && h.key).forEach(h => { hdrs[h.key] = h.value })

      const t0 = performance.now()
      const res = await fetch(url, {
        method,
        headers: hdrs,
        body: method !== 'GET' && method !== 'DELETE' && body ? body : undefined,
        signal: ctrl.signal,
      })

      const ms = Math.round(performance.now() - t0)
      setStatus(res.status)
      setElapsed(ms)

      const text = await res.text()
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2))
      } catch {
        setResponse(text)
      }
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') {
        setError((e as Error).message || 'Request failed')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ── Keyboard shortcut ──────────────────────────────────────────────── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') sendRequest()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* ── Header helpers ─────────────────────────────────────────────────── */
  function updateHeader(i: number, field: keyof KVRow, val: string | boolean) {
    setHeaders(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: val }
      if (field === 'key' && i === next.length - 1 && val) {
        next.push({ key: '', value: '', enabled: true })
      }
      return next
    })
  }

  function removeHeader(i: number) {
    setHeaders(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)
  }

  function statusColor(s: number) {
    if (s < 300) return '#14f195'
    if (s < 400) return '#ffc832'
    return '#ff4d6a'
  }

  const activeHeaders = headers.filter(h => h.enabled && h.key).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div style={{
        height: 52, borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 1.25rem',
        gap: '1rem', flexShrink: 0,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <div style={{ width: 1, height: 18, background: 'var(--border2)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HexLogo />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>P2P</span>
          <span style={{ color: 'var(--text-faint)', fontSize: '0.82rem', marginLeft: '0.2rem' }}>API Explorer</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-faint)' }}>
          <KbdIcon /> Enter to send
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRight: '1px solid var(--border)',
                overflowY: 'auto', overflowX: 'hidden',
                flexShrink: 0, background: 'var(--surface)',
              }}
            >
              <div style={{ padding: '1rem 0.75rem', minWidth: 220 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
                  Endpoints
                </div>
                {PRESETS.map(group => (
                  <div key={group.group} style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem', marginBottom: '0.35rem' }}>
                      {group.group}
                    </div>
                    {group.endpoints.map(ep => {
                      const active = activePreset?.path === ep.path && activePreset?.label === ep.label
                      return (
                        <button
                          key={ep.label}
                          onClick={() => loadPreset(ep)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.45rem 0.5rem', borderRadius: 7, textAlign: 'left',
                            background: active ? 'var(--surface3)' : 'transparent',
                            border: active ? '1px solid var(--border2)' : '1px solid transparent',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
                          onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700, fontFamily: 'var(--mono)',
                            color: METHOD_COLORS[ep.method],
                            background: METHOD_BG[ep.method],
                            padding: '0.1rem 0.35rem', borderRadius: 4, minWidth: 34, textAlign: 'center',
                          }}>
                            {ep.method}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', color: active ? 'var(--text)' : 'var(--text-dim)', fontWeight: 500 }}>{ep.label}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--mono)' }}>{ep.path}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            position: 'absolute', left: sidebarOpen ? 229 : 0, top: '50%',
            transform: 'translateY(-50%)', zIndex: 10,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            borderRadius: '0 6px 6px 0', padding: '0.4rem 0.25rem',
            color: 'var(--text-faint)', transition: 'left 0.22s ease',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {sidebarOpen ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
          </svg>
        </button>

        {/* ── Main panel ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Request bar */}
          <div style={{
            padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)',
            display: 'flex', gap: '0.6rem', flexShrink: 0,
          }}>
            <MethodSelect value={method} onChange={setMethod} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendRequest() }}
              placeholder="https://..."
              style={{
                flex: 1, background: 'var(--surface)', border: '1px solid var(--border2)',
                borderRadius: 8, padding: '0.5rem 0.85rem', color: 'var(--text)',
                fontFamily: 'var(--mono)', fontSize: '0.82rem', outline: 'none',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={sendRequest} disabled={loading}
              style={{
                padding: '0.5rem 1.25rem',
                background: loading ? 'var(--surface2)' : 'var(--purple)',
                border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600,
                fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              {loading ? <Spinner /> : <SendIcon />}
              {loading ? 'Sending…' : 'Send'}
            </motion.button>
          </div>

          {/* Config + Response */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* ── Left: config panel ──────────────────────────────────── */}
            <div style={{ width: '44%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden', minWidth: 0 }}>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                {(['parameters', 'headers', 'body'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 500,
                      color: activeTab === tab ? 'var(--text)' : 'var(--text-dim)',
                      borderBottom: activeTab === tab ? '2px solid var(--purple)' : '2px solid transparent',
                      transition: 'color 0.15s, border-color 0.15s', textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                    {tab === 'parameters' && activePreset && activePreset.params.length > 0 && (
                      <Badge count={activePreset.params.length} />
                    )}
                    {tab === 'headers' && activeHeaders > 0 && (
                      <Badge count={activeHeaders} />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <div style={{ flex: 1, overflowY: 'auto' }}>

                {/* ── Parameters tab ────────────────────────────────── */}
                {activeTab === 'parameters' && (
                  <div>
                    {/* Endpoint info card */}
                    {activePreset ? (
                      <div style={{ padding: '1rem 1.1rem 0' }}>
                        <div style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
                          padding: '0.85rem 1rem', background: 'var(--surface)',
                          border: '1px solid var(--border)', borderRadius: 10, marginBottom: '1rem',
                        }}>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--mono)',
                            color: METHOD_COLORS[activePreset.method],
                            background: METHOD_BG[activePreset.method],
                            padding: '0.18rem 0.5rem', borderRadius: 5, flexShrink: 0, marginTop: 1,
                          }}>
                            {activePreset.method}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.4rem', wordBreak: 'break-all' }}>
                              {activePreset.path}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.55 }}>
                              {activePreset.description}
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                              Returns: <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)' }}>{activePreset.returns}</span>
                            </div>
                          </div>
                        </div>

                        {/* Param rows */}
                        {activePreset.params.length === 0 ? (
                          <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                            No parameters for this endpoint.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingBottom: '1rem' }}>
                            {activePreset.params.map(param => (
                              <ParamRow
                                key={param.name}
                                param={param}
                                value={paramValues[param.name] ?? ''}
                                onChange={v => setParamValues(prev => ({ ...prev, [param.name]: v }))}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        height: '100%', minHeight: 220, color: 'var(--text-faint)', gap: '0.6rem', padding: '2rem',
                      }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                          <rect x="3" y="3" width="18" height="18" rx="3"/>
                          <path d="M9 9h6M9 12h6M9 15h4"/>
                        </svg>
                        <span style={{ fontSize: '0.82rem' }}>Select an endpoint from the sidebar to begin</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Headers tab ───────────────────────────────────── */}
                {activeTab === 'headers' && (
                  <div style={{ padding: '0.75rem' }}>
                    <KeyValueEditor
                      rows={headers}
                      onChange={updateHeader}
                      onRemove={removeHeader}
                      keyPlaceholder="header name"
                      valuePlaceholder="value"
                    />
                  </div>
                )}

                {/* ── Body tab ──────────────────────────────────────── */}
                {activeTab === 'body' && (
                  <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>
                      JSON body — used for POST / PUT requests
                    </div>
                    <textarea
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      placeholder={'{\n  "key": "value"\n}'}
                      spellCheck={false}
                      style={{
                        flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '0.75rem', color: 'var(--text)',
                        fontFamily: 'var(--mono)', fontSize: '0.8rem', resize: 'none',
                        outline: 'none', lineHeight: 1.6, minHeight: 200,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: response panel ───────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
              {/* Meta bar */}
              <div style={{
                padding: '0.55rem 1.25rem', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, minHeight: 42,
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontWeight: 700, letterSpacing: '0.06em' }}>RESPONSE</span>
                {status !== null && (
                  <>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--mono)',
                      color: statusColor(status), background: `${statusColor(status)}14`,
                      border: `1px solid ${statusColor(status)}33`, padding: '0.15rem 0.55rem', borderRadius: 5,
                    }}>
                      {status} {statusText(status)}
                    </span>
                    {elapsed !== null && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{elapsed} ms</span>
                    )}
                  </>
                )}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)', fontSize: '0.78rem' }}>
                    <Spinner small /> Sending…
                  </div>
                )}
                {response && !loading && (
                  <button
                    onClick={() => navigator.clipboard.writeText(response)}
                    style={{ marginLeft: 'auto', color: 'var(--text-faint)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <CopyIcon /> Copy
                  </button>
                )}
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {error && (
                  <div style={{
                    margin: '1rem', padding: '0.85rem 1rem',
                    background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.25)',
                    borderRadius: 8, fontSize: '0.82rem', color: 'var(--red)', fontFamily: 'var(--mono)',
                  }}>
                    {error}
                  </div>
                )}
                {!response && !error && !loading && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100%', minHeight: 200,
                    color: 'var(--text-faint)', gap: '0.5rem',
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span style={{ fontSize: '0.82rem' }}>Send a request to see the response</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}>
                      <KbdIcon /> Enter
                    </div>
                  </div>
                )}
                {response && <SyntaxJson code={response} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── ParamRow ────────────────────────────────────────────────────────────── */
function ParamRow({
  param, value, onChange,
}: {
  param: EndpointParam
  value: string
  onChange: (v: string) => void
}) {
  const isPath = param.in === 'path'

  return (
    <div style={{
      border: `1px solid ${isPath ? 'rgba(153,69,255,0.22)' : 'var(--border)'}`,
      borderRadius: 9,
      overflow: 'hidden',
      background: isPath ? 'rgba(153,69,255,0.04)' : 'var(--surface)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.85rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>
          {param.name}
        </span>

        {/* In badge */}
        <span style={{
          fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
          padding: '0.1rem 0.4rem', borderRadius: 4,
          color: isPath ? 'var(--purple)' : '#89ddff',
          background: isPath ? 'rgba(153,69,255,0.12)' : 'rgba(137,221,255,0.1)',
          border: `1px solid ${isPath ? 'rgba(153,69,255,0.25)' : 'rgba(137,221,255,0.2)'}`,
        }}>
          {param.in}
        </span>

        {/* Type badge */}
        <span style={{
          fontSize: '0.62rem', fontWeight: 600, fontFamily: 'var(--mono)',
          color: 'var(--text-faint)', background: 'var(--surface2)',
          padding: '0.1rem 0.4rem', borderRadius: 4,
        }}>
          {param.type}
        </span>

        {/* Required / Optional */}
        {param.required ? (
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, color: '#ff4d6a',
            background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.25)',
            padding: '0.1rem 0.4rem', borderRadius: 4, marginLeft: 'auto',
          }}>
            required
          </span>
        ) : (
          <span style={{
            fontSize: '0.62rem', color: 'var(--text-faint)',
            padding: '0.1rem 0.4rem', borderRadius: 4, marginLeft: 'auto',
          }}>
            optional
          </span>
        )}
      </div>

      {/* Input row */}
      <div style={{ padding: '0.6rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', lineHeight: 1.45 }}>
          {param.description}
          {param.default && (
            <span style={{ color: 'var(--text-faint)', marginLeft: '0.35rem' }}>
              Default: <code style={{ color: '#f78c6c', fontFamily: 'var(--mono)' }}>{param.default}</code>
            </span>
          )}
        </div>

        {/* Enum select or text input */}
        {param.enum ? (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
              background: 'var(--surface2)', border: `1px solid ${isPath ? 'rgba(153,69,255,0.3)' : 'var(--border2)'}`,
              borderRadius: 6, padding: '0.38rem 0.65rem', color: value ? 'var(--text)' : 'var(--text-faint)',
              fontFamily: 'var(--mono)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer',
              width: '100%',
            }}
          >
            <option value="">— choose —</option>
            {param.enum.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={param.example ? `e.g. ${param.example}` : (param.default ? `default: ${param.default}` : `Enter ${param.name}…`)}
            style={{
              background: 'var(--surface2)',
              border: `1px solid ${isPath && param.required && !value ? 'rgba(255,77,106,0.4)' : isPath ? 'rgba(153,69,255,0.3)' : 'var(--border2)'}`,
              borderRadius: 6, padding: '0.38rem 0.65rem', color: 'var(--text)',
              fontFamily: 'var(--mono)', fontSize: '0.8rem', outline: 'none', width: '100%',
              transition: 'border-color 0.15s',
            }}
          />
        )}

        {/* Warning when required path param is empty */}
        {isPath && param.required && !value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#ff4d6a' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            This field is required to build the URL
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function HexLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <path d="M13 2L23 7.5V18.5L13 24L3 18.5V7.5L13 2Z" stroke="#9945ff" strokeWidth="1.5" fill="none" />
      <path d="M13 8L18 10.75V16.25L13 19L8 16.25V10.75L13 8Z" fill="#9945ff" opacity=".35" />
      <circle cx="13" cy="13" r="2.5" fill="#14f195" />
    </svg>
  )
}

function MethodSelect({ value, onChange }: { value: Method; onChange: (m: Method) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const methods: Method[] = ['GET', 'POST', 'PUT', 'DELETE']

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '0.5rem 0.8rem', background: 'var(--surface)', border: '1px solid var(--border2)',
          borderRadius: 8, color: METHOD_COLORS[value], fontFamily: 'var(--mono)', fontWeight: 700,
          fontSize: '0.82rem', minWidth: 82, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem',
        }}
      >
        {value}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0,
              background: 'rgba(13,13,22,0.98)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--border2)', borderRadius: 8, padding: '0.3rem', zIndex: 50, minWidth: 82,
            }}
          >
            {methods.map(m => (
              <button
                key={m}
                onClick={() => { onChange(m); setOpen(false) }}
                style={{
                  display: 'block', width: '100%', padding: '0.4rem 0.6rem', borderRadius: 5,
                  fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.8rem',
                  color: METHOD_COLORS[m], textAlign: 'left',
                  background: m === value ? 'var(--surface2)' : 'transparent', transition: 'background 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = m === value ? 'var(--surface2)' : 'transparent' }}
              >
                {m}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function KeyValueEditor({
  rows, onChange, onRemove, keyPlaceholder, valuePlaceholder,
}: {
  rows: KVRow[]
  onChange: (i: number, field: keyof KVRow, val: string | boolean) => void
  onRemove: (i: number) => void
  keyPlaceholder: string
  valuePlaceholder: string
}) {
  const inputStyle: React.CSSProperties = {
    flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '0.35rem 0.6rem', color: 'var(--text)',
    fontFamily: 'var(--mono)', fontSize: '0.78rem', outline: 'none', minWidth: 0,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input
            type="checkbox" checked={row.enabled}
            onChange={e => onChange(i, 'enabled', e.target.checked)}
            style={{ width: 13, height: 13, cursor: 'pointer', accentColor: 'var(--purple)', flexShrink: 0 }}
          />
          <input value={row.key} onChange={e => onChange(i, 'key', e.target.value)} placeholder={keyPlaceholder} style={{ ...inputStyle, opacity: row.enabled ? 1 : 0.4 }} />
          <input value={row.value} onChange={e => onChange(i, 'value', e.target.value)} placeholder={valuePlaceholder} style={{ ...inputStyle, opacity: row.enabled ? 1 : 0.4 }} />
          <button onClick={() => onRemove(i)} style={{ color: 'var(--text-faint)', padding: '0.2rem', flexShrink: 0, opacity: rows.length > 1 ? 1 : 0.3 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

function SyntaxJson({ code }: { code: string }) {
  const highlighted = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"]+)"(\s*:)/g, '<span style="color:#89ddff">"$1"</span>$2')
    .replace(/:\s*"([^"]*)"/g, ': <span style="color:#c3e88d">"$1"</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#f78c6c">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span style="color:#c792ea">$1</span>')
  return (
    <pre dangerouslySetInnerHTML={{ __html: highlighted }} style={{
      padding: '1rem 1.25rem', fontFamily: 'var(--mono)', fontSize: '0.78rem',
      lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
    }} />
  )
}

function Badge({ count }: { count: number }) {
  return (
    <span style={{
      marginLeft: '0.35rem', fontSize: '0.62rem', fontWeight: 700,
      background: 'var(--purple-glow)', color: 'var(--purple)',
      border: '1px solid rgba(153,69,255,0.3)', borderRadius: 99, padding: '0 0.35rem', lineHeight: 1.6,
    }}>
      {count}
    </span>
  )
}

function statusText(s: number) {
  const map: Record<number, string> = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 422: 'Unprocessable', 500: 'Server Error' }
  return map[s] ?? ''
}

function KbdIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="2.5" />
      <path d="M6 10h8M11 7l3 3-3 3" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function Spinner({ small }: { small?: boolean }) {
  const s = small ? 12 : 14
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  )
}
