export type SkyuxConfigParams = string[] | {
  [key: string]: boolean | {
    value?: any;
    required?: boolean;
    excludeFromRequests?: boolean;
  }
};
