import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { SkyContentInfo, SkyContentInfoProvider } from '@skyux/core';
import { SkyDropdownMessage, SkyDropdownMessageType } from '@skyux/popovers';

import { Observable, Subject } from 'rxjs';

import { SkySortService } from './sort.service';

@Component({
  selector: 'sky-sort',
  styleUrls: ['./sort.component.scss'],
  templateUrl: './sort.component.html',
  providers: [SkySortService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySortComponent {
  /**
   * The ARIA label for the sort button. This sets the
   * sort button's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * The aria label should normally be context sensitive, e.g. "Sort constituents". This is especially true when multiple sort buttons are in close proximity.
   * When used inside of a toolbar which has been provided the `listDescriptor` input the ARIA label defaults to "Sort <listDescriptor>".
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Whether to display a "Sort" label beside the icon on the sort button.
   */
  @Input()
  public showButtonText: boolean | undefined = false;

  public dropdownController = new Subject<SkyDropdownMessage>();

  protected contentInfoObs: Observable<SkyContentInfo> | undefined;

  #contentInfoProvider = inject(SkyContentInfoProvider, { optional: true });

  constructor() {
    this.contentInfoObs = this.#contentInfoProvider?.getInfo();
  }

  public dropdownClicked(): void {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close,
    });
  }
}
