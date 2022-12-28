import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'sky-filter-button',
  styleUrls: ['./filter-button.component.scss'],
  templateUrl: './filter-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFilterButtonComponent {
  /**
   * An ID for the filter button.
   */
  @Input()
  public get filterButtonId(): string {
    return this.#filterButtonIdOrDefault;
  }
  public set filterButtonId(value: string | undefined) {
    this.#filterButtonIdOrDefault = value || this.#defaultButtonId;
  }

  /**
   * An ID to identify the element that contains
   * the filtering options that the filter button exposes.
   * To support [accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure),
   * this property is necessary when using inline filters.
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * Whether the filtering options are exposed.
   * To support [accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure),
   * this property is necessary when using inline filters.
   */
  @Input()
  public ariaExpanded: boolean | undefined = false;

  /**
   * Whether to highlight the filter button to indicate that filters were applied.
   * We recommend setting this property to `true` when no indication of filtering is visible
   * to users. For example, set it to `true` if you do not display the filter summary.
   */
  @Input()
  public active: boolean | undefined = false;

  /**
   * Whether to disable the filter button.
   */
  @Input()
  public disabled: boolean | undefined = false;

  /**
   * Whether to display a **Filter** label beside the icon on the filter button.
   */
  @Input()
  public showButtonText: boolean | undefined = false;

  /**
   * Fires when the filter button is selected.
   */
  @Output()
  public filterButtonClick: EventEmitter<void> = new EventEmitter();

  constructor() {
    this.#filterButtonIdOrDefault =
      this.#defaultButtonId = `sky-filter-button-${++nextId}`;
  }

  #defaultButtonId: string;
  #filterButtonIdOrDefault: string;

  public filterButtonOnClick(): void {
    this.filterButtonClick.emit();
  }
}
