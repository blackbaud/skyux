/**
 * Recursively makes all properties of a type optional, including nested objects and arrays.
 * ChartJS allows for partial configuration objects but their exposed types don't always reflect that.
 */
export type DeepPartial<T> =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- Using function is intentional to preserve function types as-is.
  T extends Function
    ? T
    : T extends Array<infer U>
      ? DeepPartialArray<U>
      : T extends object
        ? DeepPartialObject<T>
        : T | undefined;

type DeepPartialArray<T> = Array<DeepPartial<T>>;
type DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };
