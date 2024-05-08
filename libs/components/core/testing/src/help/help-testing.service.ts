import { Injectable } from '@angular/core';
import { SkyHelpOpenArgs, SkyHelpService } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyHelpTestingService extends SkyHelpService {
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
