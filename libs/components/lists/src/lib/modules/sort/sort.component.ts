import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  inject,
} from '@angular/core';
import { SkyContentInfo, SkyContentInfoProvider } from '@skyux/core';
import { SkyDropdownMessage, SkyDropdownMessageType } from '@skyux/popovers';

import { Observable, Subject } from 'rxjs';

import { SkySortItemComponent } from './sort-item.component';
import { SkySortService } from './sort.service';

@Component({
  selector: 'sky-sort',
  styleUrls: ['./sort.component.scss'],
  templateUrl: './sort.component.html',
  providers: [SkySortService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkySortComponent {
  /**
   * The ARIA label for the sort button. This sets the
   * sort button's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * Use a context-sensitive label, such as "Sort constituents." Context is especially important when multiple filter buttons are in close proximity.
   * In toolbars, sort buttons use the `listDescriptor` to provide context, and the ARIA label defaults to "Sort <listDescriptor>."
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

  @ContentChildren(SkySortItemComponent, { descendants: true })
  public sortItems!: QueryList<SkySortItemComponent>;

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
