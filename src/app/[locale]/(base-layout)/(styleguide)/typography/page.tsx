export const metadata = { title: 'Typography | Styleguide' };

/*
 * The type scale as the tokens define it: heading sizes are fluid, so resize the
 * window and the specimens move; body sizes are static on purpose.
 */

const HEADINGS = [
  { token: '--font-size-display', range: '48 → 80px', className: 'styleguide-specimen--display' },
  { token: '--font-size-h1', range: '36 → 56px', tag: 'h1' as const },
  { token: '--font-size-h2', range: '28 → 40px', tag: 'h2' as const },
  { token: '--font-size-h3', range: '24 → 30px', tag: 'h3' as const },
  { token: '--font-size-h4', range: '20 → 24px', tag: 'h4' as const },
  { token: '--font-size-h5', range: '18 → 20px', tag: 'h5' as const },
];

const BODY = [
  { token: '--font-size-text-large', size: '20px', role: 'lead paragraphs' },
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
        <h2>Headings</h2>
        {HEADINGS.map(({ token, range, tag: Tag, className }) => (
          <div className="styleguide-row" key={token}>
            <div className="styleguide-row__meta">
              <span>{token}</span>
              <span>{range}</span>
            </div>
            {Tag ? <Tag>{SAMPLE}</Tag> : <p className={className}>{SAMPLE}</p>}
          </div>
        ))}
      </section>

      <section>
        <h2>Body</h2>
        {BODY.map(({ token, size, role }) => (
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
