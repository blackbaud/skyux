import {
  Injectable
} from '@angular/core';

import {
  SkyAppOmnibarReadyArgs
} from './omnibar-ready-args';

@Injectable()
export abstract class SkyAppOmnibarProvider {

  public abstract ready(): Promise<SkyAppOmnibarReadyArgs>;

}
