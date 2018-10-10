import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  getData
} from '@skyux/list-builder/modules/list/helpers';
import {
  ListItemModel
} from '@skyux/list-builder/modules/list/state';

@Component({
  selector: 'sky-grid-cell',
  template: '<ng-template #cell></ng-template>',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyGridCellComponent implements OnInit {
  @Input()
  public item: ListItemModel;

  @Input()
  public columnId: string;

  @Input()
  private template: TemplateRef<any>;

  @Input()
  private fieldSelector: string;

  @ViewChild('cell', { read: ViewContainerRef })
  private container: ViewContainerRef;

  public ngOnInit() {
    this.container.createEmbeddedView(this.template, this);
  }

  get row() {
    return this.item.data;
  }

  get value() {
    if (this.item.data && (this.fieldSelector || this.columnId)) {
      return getData(this.item.data, this.fieldSelector || this.columnId);
    }

    return undefined;
  }
}
