import { decamelize } from '@nx/workspace/src/utils/strings';

export function dirname(path: string): string {
  const end = path.lastIndexOf('/');
  return path.substring(0, end);
}

export function capitalizeWords(string: string) {
  return decamelize(string)
    .replace(/[-_]/g, ' ')
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}
