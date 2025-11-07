import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';

import { ContextMenuComponent } from './context-menu.component';
import { GRID_DEMO_DATA, GridDemoRow } from './data';

/**
 * @title Easy grid™️
 */
@Component({
  selector: 'app-ag-grid-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContextMenuComponent, SkyGridModule],
})
export class GridBasicExampleComponent {
  protected gridData: GridDemoRow[] = GRID_DEMO_DATA;
}
