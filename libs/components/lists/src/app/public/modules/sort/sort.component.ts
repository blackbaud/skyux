import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers/modules/dropdown';

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
  public sortByHeadingId: string = `sky-sort-heading-${++nextId}`;

  @Input()
  public showButtonText = false;

  public dropdownController = new Subject<SkyDropdownMessage>();

  public dropdownClicked() {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }
}
