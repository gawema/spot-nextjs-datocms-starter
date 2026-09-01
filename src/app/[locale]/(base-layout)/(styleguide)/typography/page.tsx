import { BREAKPOINTS } from '@/lib/layout/breakpoints';
import { FLUID_FONT_SIZES, FLUID_MAX_ROOT_REM, FLUID_MIN_VW } from '@/lib/layout/fluidScale';

export const metadata = { title: 'Typography | Styleguide' };

/*
 * The type scale as the tokens define it. The fluid sizes come from the same
 * module the CSS is generated from, so this page cannot drift from the tokens:
 * resize the window and the specimens move with it.
 */

/** How to render each fluid size. A token with no entry gets a plain paragraph. */
const SPECIMEN: Record<string, { tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'; className?: string }> = {
  '--font-size-display': { className: 'styleguide-specimen--display' },
  '--font-size-h1': { tag: 'h1' },
  '--font-size-h2': { tag: 'h2' },
  '--font-size-h3': { tag: 'h3' },
  '--font-size-h4': { tag: 'h4' },
  '--font-size-h5': { tag: 'h5' },
};

const STATIC_SIZES = [
  { token: '--font-size-text-base', size: '16px', role: 'default body copy' },
  { token: '--font-size-text-small', size: '14px', role: 'captions, meta' },
  { token: '--font-size-textbutton-base', size: '16px', role: 'buttons and links' },
  { token: '--font-size-textbutton-small', size: '14px', role: 'small buttons' },
];

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

export default function TypographyPage() {
  return (
    <>
      <h1>Typography</h1>

      <section>
        <h2>Fluid sizes</h2>
        <p>
          Every size below interpolates between its two ends across viewports {FLUID_MIN_VW}px to{' '}
          {BREAKPOINTS['3xl']}px. Past that the clamps are maxed out, so the root font size grows
          instead, up to {FLUID_MAX_ROOT_REM}rem, and the whole page keeps its proportions on a very
          wide screen.
        </p>
        {FLUID_FONT_SIZES.map(({ name, minPx, maxPx, role }) => {
          const Tag = SPECIMEN[name]?.tag;
          return (
            <div className="styleguide-row" key={name}>
              <div className="styleguide-row__meta">
                <span>{name}</span>
                <span>
                  {minPx} → {maxPx}px{role ? `, ${role}` : ''}
                </span>
              </div>
              {Tag ? (
                <Tag>{SAMPLE}</Tag>
              ) : (
                <p className={SPECIMEN[name]?.className} style={{ fontSize: `var(${name})` }}>
                  {SAMPLE}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section>
        <h2>Static sizes</h2>
        {STATIC_SIZES.map(({ token, size, role }) => (
          <div className="styleguide-row" key={token}>
            <div className="styleguide-row__meta">
              <span>{token}</span>
              <span>
                {size}, {role}
              </span>
            </div>
            <p style={{ fontSize: `var(${token})` }}>{SAMPLE}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Prose</h2>
        <p>
          Element defaults come from <code>tokens/base.css</code>, so structured text renders like
          this without any section restating the scale. An <a href="#prose">inline link</a>, some{' '}
          <strong>bold</strong>, some <em>italic</em>, a bit of <code>inline code</code> and a{' '}
          <mark>highlight</mark>.
        </p>
        <ul>
          <li>An unordered list item</li>
          <li>A second one, to show the gap between siblings</li>
        </ul>
        <blockquote>
          A quote sits on the subtle surface with a border on the inline start edge.
        </blockquote>
        <pre>
          <code>{'const tokens = "generated";'}</code>
        </pre>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>--text-body</td>
              <td>Default text colour</td>
            </tr>
            <tr>
              <td>--text-muted</td>
              <td>Captions and meta</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
