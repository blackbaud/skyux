export interface PackageLockJson {
  dependencies: {
    [packageName: string]: { version: string };
  };
}
