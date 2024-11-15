import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SkyHelpOpenArgs } from './help-open-args';
import { SkyHelpUpdateArgs } from './help-update-args';

/**
 * Provides methods for opening and updating a globally accessible help dialog.
 */
@Injectable()
export abstract class SkyHelpService {
  /**
   * Emits when the help widget ready state changes.
   */
  public get widgetReadyStateChange(): Observable<boolean> {
    return of(false);
  }

  /**
   * Opens a globally accessible help dialog.
   * @param args The options for opening the help dialog.
   */
  public abstract openHelp(args?: SkyHelpOpenArgs): void;

  /**
   * Updates a globally accessible help dialog.
   * @param args The options for updating the help dialog.
   */
  public abstract updateHelp(args: SkyHelpUpdateArgs): void;
}
