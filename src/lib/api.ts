const BASE = import.meta.env.VITE_API_URL || '/api'

export interface Stats {
  markets     : number
  open_orders : number
  total_fills : number
  total_volume: number
}

export interface Market {
  address    : string
  base_mint  : string
  quote_mint : string
  base_vault : string
  quote_vault: string
  authority  : string
  tick_size  : number
  lot_size   : number
  fee_bps    : number
  created_at : number
}

export interface Order {
  address    : string
  market     : string
  owner      : string
  price      : number
  orig_qty   : number
  filled_qty : number
  side       : number
  order_type : number
  status     : string
  expiry     : number
  placed_at  : number
  updated_at : number
}

export interface MarketDetail {
  market: Market
  asks  : Order[]
  bids  : Order[]
}

export interface ApiEvent {
  id        : number
  signature : string
  market    : string | null
  event_type: number
  data      : Record<string, unknown>
  slot      : number
  timestamp : number
}

export const EVENT_TYPE_NAMES: Record<number, string> = {
  1: 'OrderPlaced',
  2: 'OrderFilled',
  3: 'OrderCancelled',
  4: 'OrderExpired',
  5: 'MarketCreated',
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  stats   : ()                    => get<Stats>('/stats'),
  markets : ()                    => get<Market[]>('/markets'),
  market  : (address: string)     => get<MarketDetail>(`/markets/${address}`),
  events  : (limit = 20)          => get<ApiEvent[]>(`/events?limit=${limit}`),
  mktEvents:(address: string, limit = 20) =>
    get<ApiEvent[]>(`/markets/${address}/events?limit=${limit}`),
}
