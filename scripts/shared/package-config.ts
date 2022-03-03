export interface PackageConfig {
  /**
   * The distribution path of the project's bundle, relative to the workspace root.
   */
  distRoot?: string;
  /**
   * The root path of the project's source code, relative to the workspace root.
   */
  root: string;

  /**
   * The name of the NPM package.
   */
  npmName?: string;
}

export interface PackageConfigs {
  [projectName: string]: PackageConfig;
}
