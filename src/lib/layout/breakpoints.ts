/**
 * Canonical breakpoint scale, and the single source of truth for it:
 * `src/app/tokens/breakpoints.css` is generated from this file by
 * `npm run generate-breakpoint-tokens`.
 *
 * Use these values for JS layout, image `sizes` and media query strings, so a
 * layout switch never disagrees between CSS and TypeScript.
 */

export const BREAKPOINTS = {
  sm: 768,
  md: 900,
  lg: 1024,
  xl: 1240,
  '2xl': 1536,
  '3xl': 1920,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/** What each breakpoint is for. Emitted as documentation into the generated CSS. */
export const BREAKPOINT_NOTES: Record<BreakpointKey, string> = {
  sm: 'mobile cutoff: layout switches, max-width queries use sm - 1 (767px)',
  md: 'two-column text layouts inside a section',
  lg: 'card grids and sliders',
  xl: 'wide layouts, oversized headings',
  '2xl': 'grid narrowing',
  '3xl': 'upper end of the fluid scale',
};

/** max-width query for viewports below `sm` (767px). */
export const MOBILE_MEDIA_QUERY = `(max-width: ${BREAKPOINTS.sm - 1}px)` as const;

export function minWidth(bp: BreakpointKey): string {
  return `(min-width: ${BREAKPOINTS[bp]}px)`;
}

export function maxWidth(bp: BreakpointKey): string {
  return `(max-width: ${BREAKPOINTS[bp] - 1}px)`;
}
