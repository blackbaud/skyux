import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAgGridColumnComponent, SkyAgGridComponent } from '@skyux/ag-grid';

import { ContextMenuComponent } from './context-menu.component';
import { AG_GRID_DEMO_DATA, AgGridDemoRow } from './data';

/**
 * @title Easy grid™️
 */
@Component({
  selector: 'app-ag-grid-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContextMenuComponent, SkyAgGridComponent, SkyAgGridColumnComponent],
})
export class AgGridBasicExampleComponent {
  protected gridData: AgGridDemoRow[] = AG_GRID_DEMO_DATA;
}
