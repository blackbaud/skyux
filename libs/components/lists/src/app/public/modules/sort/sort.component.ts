import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  SkySortService
} from './sort.service';

let nextId = 0;
@Component({
  selector: 'sky-sort',
  styleUrls: ['./sort.component.scss'],
  templateUrl: './sort.component.html',
  providers: [
    SkySortService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySortComponent {

  /**
   * Indicates whether to display a "Sort" label beside the icon on the sort button.
   */
  @Input()
  public showButtonText = false;

  public dropdownController = new Subject<SkyDropdownMessage>();

  public sortByHeadingId: string = `sky-sort-heading-${++nextId}`;

  public dropdownClicked(): void {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }
}
