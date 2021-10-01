import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  ListViewChecklistItemModel
} from './state/items/item.model';

@Component({
  selector: 'sky-list-view-checklist-item',
  templateUrl: './list-view-checklist-item.component.html',
  styleUrls: ['./list-view-checklist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyListViewChecklistItemComponent {
  @Input()
  public item: ListViewChecklistItemModel;
}
