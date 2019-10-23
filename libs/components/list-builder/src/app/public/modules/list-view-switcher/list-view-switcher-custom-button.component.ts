import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  ListViewComponent
} from '../list';

@Component({
  selector: 'sky-list-view-switcher-custom-button',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListViewSwitcherCustomButtonComponent {

  @Input()
  public icon: string;

  @Input()
  public label: string;

  @Input()
  public view: ListViewComponent;
}
