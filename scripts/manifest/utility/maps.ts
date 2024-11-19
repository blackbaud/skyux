export function toObject(map: Map<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  for (const [key, value] of map.entries()) {
    if (value instanceof Map) {
      obj[key] = toObject(value);
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

export function sortMapByKey<T = unknown>(
  value: Map<string, T>,
): Map<string, T> {
  return new Map([...value.entries()].sort());
}
