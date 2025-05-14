import { decamelize } from '@nx/devkit/src/utils/string-utils';

export function basename(path: string): string {
  const start = path.lastIndexOf('/');
  if (start > 0) {
    return path.substring(start + 1);
  } else {
    return path;
  }
}

export function dirname(path: string): string {
  const end = path.lastIndexOf('/');
  return path.substring(0, end);
}

export function capitalizeWords(string: string): string {
  return decamelize(string)
    .replace(/[-_]/g, ' ')
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}
