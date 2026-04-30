export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '3rem 2rem',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
          <Hexagon />
          P2P Protocol
        </div>

        <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { label: 'Features', href: '#features' },
            { label: 'Playground', href: '#playground' },
            { label: 'Quickstart', href: '#quickstart' },
            { label: 'npm', href: 'https://www.npmjs.com/package/@p2p-protocol/sdk', external: true },
            { label: 'GitHub', href: 'https://github.com/Rohiteswar/p2p-protocol-sdk', external: true },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              style={{ fontSize: '0.82rem', color: 'var(--text-dim)', transition: 'color 0.15s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-dim)')}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Built by{' '}
          <a
            href="https://x.com/rohiteswar3"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text)', fontWeight: 600, transition: 'color 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--purple)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
          >
            Rohiteswar Velagapudi
          </a>
        </div>
      </div>
    </footer>
  )
}

function Hexagon() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
      <path d="M13 2L23 7.5V18.5L13 24L3 18.5V7.5L13 2Z" stroke="#9945ff" strokeWidth="1.5" fill="none" />
      <path d="M13 8L18 10.75V16.25L13 19L8 16.25V10.75L13 8Z" fill="#9945ff" opacity=".35" />
      <circle cx="13" cy="13" r="2.5" fill="#14f195" />
    </svg>
  )
}
