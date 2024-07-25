import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyHelpOpenArgs, SkyHelpService } from '@skyux/core';

import { Observable, of } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyHelpTestingService extends SkyHelpService {
  public override get widgetReadyStateChange(): Observable<boolean> {
    return of(true);
  }

  #currentHelpKey: string | undefined;

  public override openHelp(args: SkyHelpOpenArgs): void {
    this.#currentHelpKey = args.helpKey;
  }

  public getCurrentHelpKey(): string | undefined {
    return this.#currentHelpKey;
  }

  public closeHelp(): void {
    this.#currentHelpKey = undefined;
  }
}
