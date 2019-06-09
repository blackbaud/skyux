import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input
} from '@angular/core';

import {
  SkyDocsDataTableColumnComponent
} from './data-table-column.component';

@Component({
  selector: 'sky-docs-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDataTableComponent implements AfterContentInit {

  @Input()
  public data: any[];

  /**
   * @internal
   */
  public columns: {
    dataPropertyReference: string;
    heading: string;
  }[] = [];

  @ContentChildren(SkyDocsDataTableColumnComponent)
  private columnComponents: QueryList<SkyDocsDataTableColumnComponent>;

  public ngAfterContentInit(): void {
    this.columnComponents.forEach((columnComponent) => {
      this.columns.push({
        dataPropertyReference: columnComponent.dataPropertyReference,
        heading: columnComponent.heading
      });
    });
  }

  public objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
