import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { SkyContentInfo, SkyContentInfoProvider } from '@skyux/core';

import { Observable } from 'rxjs';

let nextId = 0;

@Component({
  selector: 'sky-filter-button',
  styleUrls: ['./filter-button.component.scss'],
  templateUrl: './filter-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyFilterButtonComponent {
  /**
   * The ID for the filter button.
   */
  @Input()
  public get filterButtonId(): string {
    return this.#filterButtonIdOrDefault;
  }
  public set filterButtonId(value: string | undefined) {
    this.#filterButtonIdOrDefault = value || this.#defaultButtonId;
  }

  /**
   * The ID to identify the element that contains
   * the filtering options that the filter button exposes.
   * To support [accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure),
   * this property is necessary to set the `aria-controls` attribute when using inline filters.
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * Whether the filtering options are exposed.
   * To support [accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure),
   * this property is necessary to set the `aria-expanded` attribute when using inline filters.
   * For more information about the `aria-expanded` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-expanded).
   */
  @Input()
  public ariaExpanded: boolean | undefined = false;

  /**
   * The ARIA label for the filter button. This sets the
   * filter button's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * Use a context-sensitive label, such as "Filter constituents." Context is especially important when multiple filter buttons are in close proximity.
   * In toolbars, filter buttons use the `listDescriptor` to provide context, and the ARIA label defaults to "Filter <listDescriptor>."
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

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
   * Whether to display a "Filter" label beside the icon on the filter button.
   */
  @Input()
  public showButtonText: boolean | undefined = false;

  /**
   * Fires when the filter button is selected.
   */
  @Output()
  public filterButtonClick = new EventEmitter<void>();

  protected contentInfoObs: Observable<SkyContentInfo> | undefined;

  #contentInfoProvider = inject(SkyContentInfoProvider, { optional: true });

  constructor() {
    this.#filterButtonIdOrDefault =
      this.#defaultButtonId = `sky-filter-button-${++nextId}`;

    this.contentInfoObs = this.#contentInfoProvider?.getInfo();
  }

  #defaultButtonId: string;
  #filterButtonIdOrDefault: string;

  public filterButtonOnClick(): void {
    this.filterButtonClick.emit();
  }
}
