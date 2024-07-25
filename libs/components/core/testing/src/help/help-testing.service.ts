import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyHelpOpenArgs, SkyHelpService } from '@skyux/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyHelpTestingService extends SkyHelpService {
  public override get widgetReadyStateChange(): Observable<boolean> {
    return this.#widgetReadyStateChangeObs;
  }

  #currentHelpKey: string | undefined;
  #widgetReadyStateChange: BehaviorSubject<boolean>;
  #widgetReadyStateChangeObs: Observable<boolean>;

  constructor() {
    super();

    this.#widgetReadyStateChange = new BehaviorSubject<boolean>(false);
    this.#widgetReadyStateChangeObs =
      this.#widgetReadyStateChange.asObservable();
  }

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
