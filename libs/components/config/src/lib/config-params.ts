/**
 * The list of parameters that are allowed at runtime.
 */
export type SkyuxConfigParams = Record<
  string,
  | boolean
  | {
      value?: any;
      required?: boolean;
      excludeFromLinks?: boolean;
      excludeFromRequests?: boolean;
    }
>;
