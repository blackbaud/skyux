// Taken from Angular's version.ts file.
// See: https://github.com/angular/angular/blob/16.2.x/packages/core/src/version.ts

/**
 * Represents the version of a package.
 * @internal
 */
export class Version {
  public readonly major: string;
  public readonly minor: string;
  public readonly patch: string;

  constructor(public readonly full: string) {
    this.major = full.split('.')[0];
    this.minor = full.split('.')[1];
    this.patch = full.split('.').slice(2).join('.');
  }
}

/**
 * Represents the version of @skyux/core.
 */
export const VERSION = new Version('0.0.0-PLACEHOLDER');
