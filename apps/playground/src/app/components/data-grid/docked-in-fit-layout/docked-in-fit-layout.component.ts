import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPercentPipe } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyPageModule } from '@skyux/pages';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';
import { DockedMenuComponent } from '../docked-menu';

@Component({
  selector: 'app-docked-in-fit-layout',
  imports: [
    SkyDataGridColumn,
    SkyDataGrid,
    SkyPageModule,
    SkyPercentPipe,
    DockedMenuComponent,
  ],
  templateUrl: './docked-in-fit-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockedInFitLayoutComponent {
  protected readonly columns = columnDefinitions;
  protected readonly data = data;
}
export default DockedInFitLayoutComponent;
