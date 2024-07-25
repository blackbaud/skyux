/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SkyHelpOpenArgs } from './help-open-args';

/**
 * Provides methods for opening a globally accessible help dialog.
 */
@Injectable()
export abstract class SkyHelpService {
  /**
   * Emits when the help widget's ready state changes.
   */
  public get widgetReadyStateChange(): Observable<boolean> {
    return of(false);
  }

  /**
   * Opens a globally accessible help dialog.
   * @param args The options for opening the help dialog.
   */
  public abstract openHelp(args: SkyHelpOpenArgs): void;
}
