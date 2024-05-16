/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { SkyHelpOpenArgs } from './help-open-args';

/**
 * Provides methods for opening a globally accessible help dialog.
 */
@Injectable()
export abstract class SkyHelpService {
  /**
   * Opens a globally accessible help dialog.
   * @param args The options for opening the help dialog.
   */
  public abstract openHelp(args: SkyHelpOpenArgs): void;
}
