// Need to keep this export here for backwards compatibility.
export {
  SkyAppFormat
} from './app-format';

export class SkyFormat {
  public static formatText(
    format: string,
    ...args: any[]
  ): string {

    if (this.isEmpty(format)) {
      return '';
    }

    return String(format)
      .replace(
        /\{(\d+)\}/g,
        function (match, capture): string {
          return args[parseInt(capture, 10)];
        }
      );
  }

  private static isEmpty(str: string): boolean {
    /* tslint:disable-next-line:no-null-keyword */
    return str === null || str === undefined;
  }
}
