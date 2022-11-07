import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { SkyProgressIndicatorItemStatus } from '../types/progress-indicator-item-status';

const STATUS_DEFAULT = SkyProgressIndicatorItemStatus.Incomplete;

/**
 * Specifies a step to include in the progress indicator. Each step requires a label,
 * and you can also specify step details within the `sky-progress-indicator-item` element.
 */
@Component({
  selector: 'sky-progress-indicator-item',
  templateUrl: './progress-indicator-item.component.html',
  styleUrls: ['./progress-indicator-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyProgressIndicatorItemComponent implements OnInit {
  /**
   * Specifies a step label for the step in the progress indicator.
   * @required
   */
  @Input()
  public set title(value: string | undefined) {
    this.#_title = value;
    this.#updateFormattedTitle();
  }

  public get title(): string | undefined {
    return this.#_title;
  }

  public set status(value: SkyProgressIndicatorItemStatus | undefined) {
    if (value === this.#_status) {
      return;
    }

    /* istanbul ignore next */
    this.#_status = value ?? STATUS_DEFAULT;
    this.isPending = this.#_status === SkyProgressIndicatorItemStatus.Pending;
    this.isIncomplete =
      this.#_status === SkyProgressIndicatorItemStatus.Incomplete;
    this.#changeDetector.markForCheck();
  }

  public get status(): SkyProgressIndicatorItemStatus {
    return this.#_status;
  }

  public formattedTitle: string | undefined;
  public isVisible = false;
  public showStatusMarker = true;
  public showTitle = true;
  public isPending = false;
  public isIncomplete = true;

  #titlePrefix: string | undefined;
  #changeDetector: ChangeDetectorRef;

  #_title: string | undefined;
  #_status = STATUS_DEFAULT;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public ngOnInit(): void {
    this.#updateFormattedTitle();
  }

  public showStepNumber(step: number): void {
    this.#titlePrefix = `${step} - `;
    this.#updateFormattedTitle();
  }

  public hideStepNumber(): void {
    this.#titlePrefix = '';
    this.#updateFormattedTitle();
  }

  #updateFormattedTitle(): void {
    this.formattedTitle = `${this.#titlePrefix}${this.title}`;
  }
}
