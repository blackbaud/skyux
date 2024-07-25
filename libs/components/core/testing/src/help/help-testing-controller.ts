import { inject } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyHelpService } from '@skyux/core';

import { firstValueFrom } from 'rxjs';

import { SkyHelpTestingService } from './help-testing.service';

function formatHelpKeyForError(helpKey: string | undefined): string {
  return helpKey === undefined ? 'undefined' : `'${helpKey}'`;
}

/**
 * Provides methods for validating global help in unit tests.
 */
export class SkyHelpTestingController {
  #helpSvc = inject(SkyHelpService) as SkyHelpTestingService;

  /**
   * Validates the current help key and throws an error if the current help key does not match the expected help key.
   * @param expectedHelpKey The expected help key.
   */
  public expectCurrentHelpKey(expectedHelpKey: string | undefined): void {
    const currentHelpKey = this.#helpSvc.getCurrentHelpKey();

    if (currentHelpKey !== expectedHelpKey) {
      throw new Error(
        `Expected current help key to be ${formatHelpKeyForError(expectedHelpKey)}, but the current help key is ${formatHelpKeyForError(currentHelpKey)}.`,
      );
    }
  }

  public async expectWidgetReadyState(readyState: boolean): Promise<void> {
    const actualReadyState = await firstValueFrom(
      this.#helpSvc.widgetReadyStateChange,
    );

    if (readyState !== actualReadyState) {
      throw new Error(
        `Expected a widget ready state of "${readyState}", but received "${actualReadyState}".`,
      );
    }
  }

  /**
   * Close the current help.
   */
  public closeHelp(): void {
    this.#helpSvc.closeHelp();
  }
}
