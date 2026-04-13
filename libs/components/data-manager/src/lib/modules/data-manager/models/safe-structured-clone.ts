/**
 * @internal
 */
export function safeStructuredClone<T>(value: T): T {
  if (value === undefined || value === null) {
    return value;
  }

  try {
    // structuredClone may throw if the value is not cloneable.
    return structuredClone(value);
  } catch {
    // Fall back to returning the original reference to avoid unexpected runtime errors.
    return value;
  }
}
