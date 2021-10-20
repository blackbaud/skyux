import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'sky-filter-button',
  styleUrls: ['./filter-button.component.scss'],
  templateUrl: './filter-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFilterButtonComponent {

  /**
   * Specifies an ID for the filter button.
   */
  @Input()
  public get filterButtonId() {
    return this._filterButtonId || `sky-filter-button-${++nextId}`;
  }
  public set filterButtonId(value: string) {
    this._filterButtonId = value;
  }

  /**
   * Specifies an ID to identify the element that contains
   * the filtering options that the filter button exposes.
   * To support [accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure),
   * this property is necessary when using inline filters.
   */
  @Input()
  public ariaControls: string;

  /**
   * Indicates whether the filtering options are exposed.
   * To support [accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure),
   * this property is necessary when using inline filters.
   */
  @Input()
  public ariaExpanded: boolean;

  /**
   * Indicates whether to highlight the filter button to indicate that filters were applied.
   * We recommend setting this property to `true` when no indication of filtering is visible
   * to users. For example, set it to `true` if you do not display the filter summary.
   */
  @Input()
  public active = false;

  /**
   * Indicates whether to disable the filter button.
   */
  @Input()
  public disabled: boolean = false;

  /**
   * Indicates whether to display a **Filter** label beside the icon on the filter button.
   */
  @Input()
  public showButtonText = false;

  /**
   * Fires when the filter button is selected.
   */
  @Output()
  public filterButtonClick: EventEmitter<any> = new EventEmitter();

  private _filterButtonId: string;

  public filterButtonOnClick(): void {
    this.filterButtonClick.emit(undefined);
  }
}
