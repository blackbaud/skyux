import { Injectable } from '@angular/core';
import { SkyHelpOpenArgs, SkyHelpService } from '@skyux/core';

@Injectable()
export class PlaygroundHelpService implements SkyHelpService {
  public openHelp(args: SkyHelpOpenArgs): void {
    alert('help key: ' + args.helpKey);
  }
}
