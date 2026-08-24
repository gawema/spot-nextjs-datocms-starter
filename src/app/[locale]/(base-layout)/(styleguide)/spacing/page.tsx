import { BREAKPOINTS, BREAKPOINT_NOTES } from '@/lib/layout/breakpoints';

export const metadata = { title: 'Spacing | Styleguide' };

/*
 * Two scales: the static one for spacing inside a component, and the fluid one
 * for the rhythm between sections. The fluid bars grow with the viewport.
 *
 * The breakpoint table reads the same module the CSS is generated from, so this
 * page cannot drift from the tokens.
 */

const MICRO = [
  '--spacing-space-extra-small',
  '--spacing-space-small',
  '--spacing-space-medium',
  '--spacing-space-large',
  '--spacing-space-extra-large',
  '--spacing-space-2-extra-large',
  '--spacing-space-3-extra-large',
  '--spacing-space-4-extra-large',
];

const RHYTHM = [
  { token: '--padding-vertical-small', range: '24 → 32px' },
  { token: '--padding-vertical-main', range: '48 → 64px' },
  { token: '--padding-vertical-large', range: '96 → 128px' },
  { token: '--padding-vertical-xl', range: '128 → 192px' },
];

const GUTTERS = [
  { token: '--padding-horizontal-padding-global', range: '16 → 24px' },
  { token: '--padding-horizontal-container-gutter', range: '16 → 24px' },
  { token: '--viewport-grid-gutter', range: '12 → 16px' },
];

const RADII = [
  '--corner-radius-small',
  '--corner-radius-medium',
  '--corner-radius-large',
  '--corner-radius-full',
];

export default function SpacingPage() {
  return (
    <>
      <h1>Spacing</h1>

      <section>
        <h2>Inside a component</h2>
        {MICRO.map((token) => (
          <div className="styleguide-row" key={token}>
            <div className="styleguide-row__meta">
              <span>{token}</span>
            </div>
            <div className="styleguide-bar" style={{ width: `var(${token})` }} />
          </div>
        ))}
      </section>

      <section>
        <h2>Between sections, fluid</h2>
        {RHYTHM.map(({ token, range }) => (
          <div className="styleguide-row" key={token}>
            <div className="styleguide-row__meta">
              <span>{token}</span>
              <span>{range}</span>
            </div>
            <div className="styleguide-block" style={{ height: `var(${token})` }} />
          </div>
        ))}
      </section>

      <section>
        <h2>Gutters, fluid</h2>
        {GUTTERS.map(({ token, range }) => (
          <div className="styleguide-row" key={token}>
            <div className="styleguide-row__meta">
              <span>{token}</span>
              <span>{range}</span>
            </div>
            <div className="styleguide-bar" style={{ width: `var(${token})` }} />
          </div>
        ))}
      </section>

      <section>
        <h2>Corner radius</h2>
        <div className="styleguide-swatches">
          {RADII.map((token) => (
            <div
              className="styleguide-swatch"
              key={token}
              style={{ borderRadius: `var(${token})` }}
            >
              {token.replace('--corner-radius-', '')}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Breakpoints</h2>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>What it is for</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(BREAKPOINTS).map(([key, px]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{px}px</td>
                <td>{BREAKPOINT_NOTES[key as keyof typeof BREAKPOINTS]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
