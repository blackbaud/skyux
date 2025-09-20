import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeComponentClassDirective, SkyThemeModule } from '@skyux/theme';

/**
 * Specifies secondary actions.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyDropdownModule, SkyThemeModule],
  selector: 'sky-summary-action-bar-secondary-action',
  styleUrls: ['./summary-action-bar-secondary-action.component.scss'],
  templateUrl: './summary-action-bar-secondary-action.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkySummaryActionBarSecondaryActionComponent {
  /**
   * Whether to disable a secondary action.
   * @default false
   */
  @Input()
  public disabled = false;

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

  #_isDropdown: boolean | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public onButtonClicked(): void {
    this.actionClick.emit();
  }
}
