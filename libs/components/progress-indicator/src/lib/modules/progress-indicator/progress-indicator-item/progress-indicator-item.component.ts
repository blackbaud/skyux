import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { SkyProgressIndicatorItemStatus } from '../types/progress-indicator-item-status';

const STATUS_DEFAULT = SkyProgressIndicatorItemStatus.Incomplete;
const STATUS_NAME_DEFAULT = 'incomplete';

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
   * The step label for the step in the progress indicator.
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

    switch (this.#_status) {
      case SkyProgressIndicatorItemStatus.Active:
        this.statusName = 'active';
        break;
      case SkyProgressIndicatorItemStatus.Complete:
        this.statusName = 'complete';
        break;
      case SkyProgressIndicatorItemStatus.Incomplete:
        this.statusName = 'incomplete';
        break;
      case SkyProgressIndicatorItemStatus.Pending:
        this.statusName = 'pending';
        break;
    }

    this.#changeDetector.markForCheck();
  }

  public get status(): SkyProgressIndicatorItemStatus {
    return this.#_status;
  }

  public formattedTitle: string | undefined;

  public set isVisible(value: boolean | undefined) {
    this.#_isVisible = !!value;
    this.#changeDetector.markForCheck();
  }

  public get isVisible(): boolean {
    return this.#_isVisible;
  }

  public set showStatusMarker(value: boolean | undefined) {
    this.#_showStatusMarker = !!value;
    this.#changeDetector.markForCheck();
  }

  public get showStatusMarker(): boolean {
    return this.#_showStatusMarker;
  }

  public set showTitle(value: boolean | undefined) {
    this.#_showTitle = !!value;
    this.#changeDetector.markForCheck();
  }

  public get showTitle(): boolean {
    return this.#_showTitle;
  }

  public statusName = STATUS_NAME_DEFAULT;

  #titlePrefix: string | undefined;
  #changeDetector: ChangeDetectorRef;

  #_isVisible = false;
  #_title: string | undefined;
  #_showStatusMarker = true;
  #_showTitle = true;
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
    this.#changeDetector.markForCheck();
  }
}
