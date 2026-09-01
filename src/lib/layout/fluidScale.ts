/**
 * Canonical fluid scale, and the single source of truth for it:
 * `src/app/tokens/fluid.css` is generated from this file by
 * `npm run generate-fluid-tokens`, and the styleguide prints the same ranges,
 * so a value cannot be tuned in one place and stale in the other.
 *
 * Every token interpolates linearly between its size at `FLUID_MIN_VW` and its
 * size at the top of the breakpoint scale, Utopia style, so nothing needs a
 * media query to grow. Above that width the root font size takes over.
 */

export type FluidToken = {
  name: string;
  minPx: number;
  maxPx: number;
  /** What the token is for. Emitted into the generated CSS and the styleguide. */
  role?: string;
};

/** Viewport at which every token sits at its minimum. The top end is `BREAKPOINTS['3xl']`. */
export const FLUID_MIN_VW = 375;

/** Root size the rem values are computed against. */
export const FLUID_ROOT_PX = 16;

/** How far the root font size may grow past the design range, in rem. */
export const FLUID_MAX_ROOT_REM = 2;

/**
 * Type. Headings are fluid and so is the lead paragraph; body copy is not, see
 * primitives.css: 16px reads the same on any screen and respects the reader's
 * own font-size setting.
 */
export const FLUID_FONT_SIZES: FluidToken[] = [
  { name: '--font-size-display', minPx: 52, maxPx: 96, role: 'hero and page titles' },
  { name: '--font-size-h1', minPx: 40, maxPx: 64 },
  { name: '--font-size-h2', minPx: 32, maxPx: 48 },
  { name: '--font-size-h3', minPx: 26, maxPx: 36 },
  { name: '--font-size-h4', minPx: 22, maxPx: 26 },
  { name: '--font-size-h5', minPx: 20, maxPx: 22 },
  { name: '--font-size-text-large', minPx: 20, maxPx: 24, role: 'lead paragraphs' },
];

/** Vertical rhythm and horizontal gutters. */
export const FLUID_SPACING: FluidToken[] = [
  { name: '--padding-vertical-small', minPx: 24, maxPx: 32 },
  { name: '--padding-vertical-main', minPx: 48, maxPx: 64 },
  { name: '--padding-vertical-large', minPx: 96, maxPx: 128 },
  { name: '--padding-vertical-xl', minPx: 128, maxPx: 192 },
  { name: '--padding-horizontal-padding-global', minPx: 16, maxPx: 24 },
  { name: '--padding-horizontal-container-gutter', minPx: 16, maxPx: 24 },
  { name: '--viewport-grid-gutter', minPx: 12, maxPx: 16 },
];

export const FLUID_TOKENS: FluidToken[] = [...FLUID_FONT_SIZES, ...FLUID_SPACING];
