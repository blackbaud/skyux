import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

import { SkyProgressIndicatorComponent } from '../progress-indicator.component';
import { SkyProgressIndicatorMessageType } from '../types/progress-indicator-message-type';

/**
 * Displays a button to mark all items in the progress indicator as incomplete and set the
 * first item as the active item. The steps after the active item remain incomplete until
 * users reach them in their sequential order.
 */
@Component({
  selector: 'sky-progress-indicator-reset-button',
  templateUrl: './progress-indicator-reset-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyProgressIndicatorResetButtonComponent implements OnDestroy {
  /**
   * Whether to disable the reset button.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = coerceBooleanProperty(value);
    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * The progress indicator component to associate with the reset button.
   * @required
   */
  @Input()
  public progressIndicator: SkyProgressIndicatorComponent | undefined;

  /**
   * Fires when users select the reset button that marks all items as incomplete and sets the
   * first item as the active item.
   */
  @Output()
  public resetClick = new EventEmitter<void>();

  #_disabled = false;
  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
    console.warn(
      '[Deprecation warning] The `<sky-progress-indicator-reset-button>` component is ' +
        'deprecated. Please use the `<sky-progress-indicator-nav-button>` component instead, with ' +
        '`buttonType` set to "reset".'
    );
  }

  public ngOnDestroy(): void {
    this.resetClick.complete();
  }

  public onClick(): void {
    this.resetClick.emit();

    this.progressIndicator?.sendMessage({
      type: SkyProgressIndicatorMessageType.Reset,
    });
  }
}
