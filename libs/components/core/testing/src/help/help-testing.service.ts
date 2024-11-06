import { Injectable } from '@angular/core';
import {
  SkyHelpOpenArgs,
  SkyHelpService,
  SkyHelpUpdateArgs,
} from '@skyux/core';

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
  #currentPageHelpKey: string | undefined;

  public override openHelp(args?: SkyHelpOpenArgs): void {
    this.#currentHelpKey = args?.helpKey;
  }

  public override updateHelp(args: SkyHelpUpdateArgs): void {
    if ('pageDefaultHelpKey' in args) {
      this.#currentPageHelpKey = args.pageDefaultHelpKey;
    }

    if ('helpKey' in args) {
      this.#currentHelpKey = args.helpKey;
    }
  }

  public getCurrentHelpKey(): string | undefined {
    return this.#currentHelpKey || this.#currentPageHelpKey;
  }

  public closeHelp(): void {
    this.#currentHelpKey = undefined;
  }
}
