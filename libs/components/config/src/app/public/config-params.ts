export type SkyuxConfigParams = {
  [key: string]: boolean | {
    value?: any;
    required?: boolean;
    excludeFromRequests?: boolean;
  }
};
