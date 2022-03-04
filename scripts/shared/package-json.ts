export interface PackageJsonDependencies {
  [packageName: string]: string;
}

export interface PackageJson {
  author?: string;
  bugs?: string;
  dependencies?: PackageJsonDependencies;
  description?: string;
  devDependencies?: PackageJsonDependencies;
  homepage?: string;
  keywords?: string[];
  license?: string;
  'ng-add'?: {
    save?: string;
  };
  'ng-update'?: {
    migrations?: string;
    packageUpdate?: { [packageName: string]: string };
  };
  name?: string;
  peerDependencies?: PackageJsonDependencies;
  repository?: { type?: string; url?: string };
  schematics?: string;
  version?: string;

  // allow all other types
  [_: string]: any;
}
