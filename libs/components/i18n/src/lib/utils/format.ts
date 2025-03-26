// Using this class instead of the one found in `@skyux/core`
// to avoid a circular dependency.

export class Format {
  public static formatText(format: string, ...args: any[]): string {
    return String(format).replace(
      /\{(\d+)\}/g,
      function (match, capture): string {
        const argsIndex = parseInt(capture, 10);
        return args[argsIndex] === undefined ? match : args[argsIndex];
      },
    );
  }
}
