/**
 * Specifies a list of parameters that are allowed at runtime.
 */
export type SkyuxConfigParams = {
  [key: string]: boolean | {
    value?: any;
    required?: boolean;
    excludeFromRequests?: boolean;
  }
};
