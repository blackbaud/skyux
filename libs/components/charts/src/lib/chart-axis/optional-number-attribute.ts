import { numberAttribute } from '@angular/core';

/**
 * Coerces an attribute to a number, treating unset and invalid values as
 * `undefined`.
 */
export function optionalNumberAttribute(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const num = numberAttribute(value);

  return Number.isNaN(num) ? undefined : num;
}
