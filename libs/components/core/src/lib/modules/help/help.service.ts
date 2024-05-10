/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { SkyHelpOpenArgs } from './help-open-args';

/**
 * Provides methods for opening a globally accessible help dialog.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyHelpService {
  /**
   * Opens a globally accessible help dialog.
   * @param args The options for opening the help dialog.
   */
  public openHelp(args: SkyHelpOpenArgs): void {
    console.warn('Global help is not implemented for this application.');
  }
}
