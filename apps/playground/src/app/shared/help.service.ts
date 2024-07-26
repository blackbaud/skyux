import { Injectable } from '@angular/core';
import { SkyHelpOpenArgs, SkyHelpService } from '@skyux/core';

@Injectable()
export class PlaygroundHelpService extends SkyHelpService {
  public override openHelp(args: SkyHelpOpenArgs): void {
    alert('help key: ' + args.helpKey);
  }
}
