import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { SkyDefaultInputProvider } from '@skyux/core';
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
   * Whether to display a "Sort" label beside the icon on the sort button.
   */
  @Input()
  public showButtonText: boolean | undefined = false;

  public dropdownController = new Subject<SkyDropdownMessage>();

  protected ariaLabelDefault: Observable<string> | undefined;

  #defaultInputProvider = inject(SkyDefaultInputProvider, { optional: true });

  constructor() {
    this.ariaLabelDefault = this.#defaultInputProvider?.getValue<string>(
      'sort',
      'ariaLabel'
    );
  }

  public dropdownClicked(): void {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close,
    });
  }
}
