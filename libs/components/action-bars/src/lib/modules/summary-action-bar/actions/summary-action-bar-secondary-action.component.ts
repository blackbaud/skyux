import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * Specifies secondary actions.
 */
@Component({
  selector: 'sky-summary-action-bar-secondary-action',
  templateUrl: './summary-action-bar-secondary-action.component.html',
  styleUrls: ['./summary-action-bar-secondary-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySummaryActionBarSecondaryActionComponent {
  /**
   * Whether to disable a secondary action.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = coerceBooleanProperty(value);
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public set isDropdown(value: boolean | undefined) {
    this.#_isDropdown = value;
    this.#changeDetector.detectChanges();
  }

  public get isDropdown(): boolean | undefined {
    return this.#_isDropdown;
  }

  /**
   * Fires when users select a secondary action.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  #_disabled = false;
  #_isDropdown: boolean | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public onButtonClicked(): void {
    this.actionClick.emit();
  }
}
