import { BREAKPOINTS, BREAKPOINT_NOTES } from '@/lib/layout/breakpoints';
import { FLUID_SPACING } from '@/lib/layout/fluidScale';

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

const isRhythm = (name: string) => name.startsWith('--padding-vertical');

const RHYTHM = FLUID_SPACING.filter(({ name }) => isRhythm(name));
const GUTTERS = FLUID_SPACING.filter(({ name }) => !isRhythm(name));

/* The lanes of `.layout-lanes`, widest first. `content` needs no attribute. */
const LANES = [
  { lane: 'bleed', note: 'edge to edge, the outer tracks of the grid' },
  { lane: 'wide', note: 'one --layout-wide-step past content, each side' },
  { lane: 'content', note: 'the default: --layout-content, or the viewport minus the gutter' },
  { lane: 'measure', note: 'content, capped to --layout-measure' },
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
        {RHYTHM.map(({ name, minPx, maxPx }) => (
          <div className="styleguide-row" key={name}>
            <div className="styleguide-row__meta">
              <span>{name}</span>
              <span>
                {minPx} → {maxPx}px
              </span>
            </div>
            <div className="styleguide-block" style={{ height: `var(${name})` }} />
          </div>
        ))}
      </section>

      <section>
        <h2>Gutters, fluid</h2>
        {GUTTERS.map(({ name, minPx, maxPx }) => (
          <div className="styleguide-row" key={name}>
            <div className="styleguide-row__meta">
              <span>{name}</span>
              <span>
                {minPx} → {maxPx}px
              </span>
            </div>
            <div className="styleguide-bar" style={{ width: `var(${name})` }} />
          </div>
        ))}
      </section>

      <section>
        <h2>Widths</h2>
        <p>
          How wide a component may go. A section picks a lane, and everything inside it either
          inherits that width or, for prose, the measure. The model below is the real{' '}
          <code>.layout-lanes</code> grid with the tokens scaled down so it fits this page.
        </p>
        <div className="styleguide-lanes layout-lanes">
          {LANES.map(({ lane, note }) => (
            <div className="styleguide-lane" data-lane={lane} key={lane}>
              {lane}
              <span>{note}</span>
            </div>
          ))}
        </div>
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
