import { Injectable } from '@angular/core';
import {
  SkyHelpOpenArgs,
  SkyHelpService,
  SkyHelpUpdateArgs,
} from '@skyux/core';

@Injectable()
export class ExampleHelpService extends SkyHelpService {
  public override openHelp(args?: SkyHelpOpenArgs): void {
    console.log(`Help opened with key '${args?.helpKey}'.`);
  }

  public override updateHelp(args: SkyHelpUpdateArgs): void {
    /* */
  }
}
