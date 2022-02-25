/**
 * Removes diacritical characters from strings and replaces them with their normalized equivalent.
 * For example: è becomes e, Å becomes A.
 */
export function normalizeDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
