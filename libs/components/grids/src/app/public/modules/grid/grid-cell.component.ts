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
  getData,
  ListItemModel
} from '@skyux/list-builder-common';

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

  @ViewChild('cell', {
    read: ViewContainerRef,
    static: true
  })
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
