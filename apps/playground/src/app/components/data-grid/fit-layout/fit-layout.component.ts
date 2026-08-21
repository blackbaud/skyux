import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyPercentPipe } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyPageModule } from '@skyux/pages';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';

@Component({
  selector: 'app-fit-layout',
  imports: [
    SkyDataGridColumn,
    SkyDataGrid,
    SkyPageModule,
    RouterLink,
    SkyPercentPipe,
  ],
  templateUrl: './fit-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitLayoutComponent {
  protected readonly columns = columnDefinitions;
  protected readonly data = data;
}
export default FitLayoutComponent;
