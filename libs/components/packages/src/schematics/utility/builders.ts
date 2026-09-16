export const WEBPACK_BUILDERS = [
  '@angular-devkit/build-angular:browser',
  '@blackbaud-internal/skyux-angular-builders:browser',
];

export const ESBUILD_BUILDERS = [
  '@angular/build:application',
  '@angular-devkit/build-angular:application',
  '@angular-devkit/build-angular:browser-esbuild',
  '@blackbaud-internal/skyux-build:application',
];

export const KARMA_BUILDERS = [
  '@angular/build:karma',
  '@angular-devkit/build-angular:karma',
  '@blackbaud-internal/skyux-angular-builders:karma',
];

/**
 * Whether the builder for the given architect type respects a "styles" option.
 */
export function builderHasStylesOption(builderName: string): boolean {
  return (
    WEBPACK_BUILDERS.includes(builderName) ||
    ESBUILD_BUILDERS.includes(builderName) ||
    KARMA_BUILDERS.includes(builderName)
  );
}
