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
  selector: 'sky-grid-cell:not(.legacy)',
  template: '<ng-template #cell />',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyGridCellComponent implements OnInit {
  @Input()
  public item: ListItemModel;

  @Input()
  public columnId: string;

  @Input()
  public template: TemplateRef<unknown>;

  @Input()
  public fieldSelector: string;

  @ViewChild('cell', {
    read: ViewContainerRef,
    static: true,
  })
  private container: ViewContainerRef;

  public ngOnInit(): void {
    this.container.createEmbeddedView(this.template, this);
  }

  public get row(): any {
    return this.item.data;
  }

  public get value(): any {
    if (this.item.data && (this.fieldSelector || this.columnId)) {
      return getData(this.item.data, this.fieldSelector || this.columnId);
    }

    return undefined;
  }
}
