/**
 * Joins class names, dropping anything falsy, so a conditional class can be
 * written inline as `condition && 'the-class'`.
 */
export function classList(values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
