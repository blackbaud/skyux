import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ListItemModel, getData } from '@skyux/list-builder-common';

/**
 * @internal
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
@Component({
  selector: 'sky-grid-cell',
  template: '<ng-template #cell></ng-template>',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    static: true,
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
