import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyAppFormat {
  public formatText(
    format: string,
    ...args: any[]
  ): string {
    return String(format).replace(
      /\{(\d+)\}/g,
      function (match, capture): string {
        return args[parseInt(capture, 10)];
      }
    );
  }
}
