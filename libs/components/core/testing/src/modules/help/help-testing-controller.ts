import { inject } from '@angular/core';
import { SkyHelpService } from '@skyux/core';

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

  /**
   * Close the current help.
   */
  public closeHelp(): void {
    this.#helpSvc.closeHelp();
  }
}
