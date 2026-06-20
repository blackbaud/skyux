import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';
import { SkyPageModule } from '@skyux/pages';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';

@Component({
  selector: 'app-fit-layout',
  imports: [
    SkyDataGridColumnComponent,
    SkyDataGridComponent,
    SkyPageModule,
    RouterLink,
  ],
  templateUrl: './fit-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitLayoutComponent {
  protected readonly columns = columnDefinitions;
  protected readonly data = data;
}
export default FitLayoutComponent;
