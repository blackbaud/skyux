/**
 * Standardize keys to be uppercase, due to some language limitations
 * with lowercase characters.
 * See: https://stackoverflow.com/questions/234591/upper-vs-lower-case
 */
export function getLocaleIdFromFileName(fileName: string): string {
  return fileName
    .split('.json')[0]
    .split('resources_')[1]
    .toLocaleUpperCase()
    .replace('_', '-');
}
