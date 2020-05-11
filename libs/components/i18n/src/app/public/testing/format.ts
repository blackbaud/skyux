// This file is a duplicate of the one in the production package since all files need to be
// local to the testing module.

// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export class Format {
  public static formatText(format: string, ...args: any[]): string {
    return String(format).replace(
      /\{(\d+)\}/g,
      function (match, capture): string {
        const argsIndex = parseInt(capture, 10);
        return args[argsIndex] === undefined ? match : args[argsIndex];
      }
    );
  }
}
