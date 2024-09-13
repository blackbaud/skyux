import { Injectable } from '@angular/core';
import {
  SkyHelpOpenArgs,
  SkyHelpService,
  SkyHelpUpdateArgs,
} from '@skyux/core';

@Injectable()
export class PlaygroundHelpService extends SkyHelpService {
  public override openHelp(args?: SkyHelpOpenArgs): void {
    if (args) {
      alert('help key: ' + args.helpKey);
    }
  }

  public override updateHelp(args: SkyHelpUpdateArgs): void {
    if ('helpKey' in args) {
      alert('help key update: ' + args.helpKey);
    }

    if ('pageDefaultHelpKey' in args) {
      alert('page default help key update: ' + args.pageDefaultHelpKey);
    }
  }
}
