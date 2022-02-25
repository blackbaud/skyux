export interface PackageJsonDependencies {
  [packageName: string]: string;
}

export interface PackageJson {
  dependencies?: PackageJsonDependencies;
  devDependencies?: PackageJsonDependencies;
  peerDependencies?: PackageJsonDependencies;
  name: string;
  version: string;
}
