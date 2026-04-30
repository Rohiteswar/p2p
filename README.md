# P2P Protocol — Website

Landing page for [P2P Protocol](https://github.com/Rohiteswar/p2p-protocol-sdk), a fully on-chain limit order DEX built on Solana. Built with React 18, Vite, and motion.dev for fluid animations.

---

## Overview

This is the marketing and documentation website for P2P Protocol. It gives developers a visual introduction to the protocol, lets them explore the on-chain contract directly, simulate the orderbook in the browser, and get started with the TypeScript SDK — all without connecting a wallet.

## Sections

| Section | Description |
|---|---|
| **Hero** | Animated headline, npm install bar, protocol stats |
| **Features** | 6 protocol feature cards with staggered entrance animations |
| **On-Chain** | Program address with copy, direct Solana Explorer links |
| **Playground** | Fully interactive orderbook simulation — place, fill, cancel orders |
| **SDK** | Tabbed code examples for all 4 SDK operations |
| **Footer** | Navigation links and author credit |

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — build tool and dev server
- **TypeScript** — full type safety
- **motion.dev v11** — animations (`useMotionValue`, `useSpring`, `AnimatePresence`, `whileInView`)
- **Vercel** — deployment with SPA rewrite

## Project Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css                   # CSS variables, keyframes, syntax highlight classes
└── components/
    ├── Nav.tsx                 # Sticky nav with scroll blur transition
    ├── Hero.tsx                # Mouse-follow glow, animated headline, stats row
    ├── Features.tsx            # 6-card feature grid with stagger animation
    ├── ContractExplorer.tsx    # Program ID, copy button, Solana Explorer links
    ├── Simulation.tsx          # Interactive orderbook — full order matching logic
    ├── Quickstart.tsx          # Tabbed SDK code examples with syntax highlighting
    └── Footer.tsx              # Links + author credit
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/Rohiteswar/p2p.git
cd p2p
npm install
```

### Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Output is in `dist/`. Preview it locally with:

```bash
npm run preview
```

## Deploying to Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

The `vercel.json` SPA rewrite is already included — all routes redirect to `index.html`.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Playground — How It Works

The Playground section runs a fully client-side order matching engine:

- **Limit** — rests on the book until filled or cancelled
- **IOC** (Immediate-or-Cancel) — fills what it can, cancels the remainder
- **FOK** (Fill-or-Kill) — fills entirely or cancels completely
- **Post-Only** — rests on the book only if it doesn't cross the spread

All order state is held in React (`useState`). `AnimatePresence` animates rows in and out as orders are placed, filled, or cancelled. The depth bars animate with `motion.div` width transitions.

## Design System

All design tokens are CSS variables defined in `src/index.css`:

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#07070e` | Page background |
| `--surface` | `#0d0d16` | Card / section background |
| `--purple` | `#9945ff` | Primary accent |
| `--green` | `#14f195` | Bid / success |
| `--red` | `#ff4d6a` | Ask / error |
| `--text-dim` | `#7a7a96` | Secondary text |
| `--mono` | JetBrains Mono | Code blocks |

## Contract

The protocol is deployed on **Solana Devnet**:

```
Program ID: HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18
```

[View on Solana Explorer](https://explorer.solana.com/address/HazZUxenwxgxDumK5rt89mhXfffnVpA7Nyvx87kMts18?cluster=devnet)

## Related

- [p2p-protocol-sdk](https://github.com/Rohiteswar/p2p-protocol-sdk) — TypeScript SDK
- [@p2p-protocol/sdk](https://www.npmjs.com/package/@p2p-protocol/sdk) — npm package

## Author

Built by [Rohiteswar Velagapudi](https://x.com/rohiteswar3)
