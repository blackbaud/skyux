import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyPercentPipe } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyPageModule } from '@skyux/pages';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';
import { DockedInModalButtonComponent } from '../docked-in-modal/docked-in-modal-button.component';

@Component({
  selector: 'app-docked-in-fit-layout',
  imports: [
    SkyDataGridColumn,
    SkyDataGrid,
    SkyPageModule,
    RouterLink,
    SkyPercentPipe,
    DockedInModalButtonComponent,
  ],
  templateUrl: './docked-in-fit-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockedInFitLayoutComponent {
  protected readonly columns = columnDefinitions;
  protected readonly data = data;
}
export default DockedInFitLayoutComponent;
