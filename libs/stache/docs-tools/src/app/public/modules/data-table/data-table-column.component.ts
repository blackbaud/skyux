import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-data-table-column',
  templateUrl: './data-table-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDataTableColumnComponent {

  @Input()
  public dataPropertyReference: string;

  @Input()
  public heading: string;

}
