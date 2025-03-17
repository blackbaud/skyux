import { Injectable } from '@angular/core';
import {
  SkyHelpOpenArgs,
  SkyHelpService,
  SkyHelpUpdateArgs,
} from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class ExampleHelpService extends SkyHelpService {
  public override openHelp(args?: SkyHelpOpenArgs): void {
    console.log(`Help opened with key '${args?.helpKey}'.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override updateHelp(args: SkyHelpUpdateArgs): void {
    /* */
  }
}
