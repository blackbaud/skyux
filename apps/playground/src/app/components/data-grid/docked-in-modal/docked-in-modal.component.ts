import { Component, inject } from '@angular/core';
import { SkyPercentPipe } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';

@Component({
  selector: 'app-docked-in-modal',
  imports: [SkyModalModule, SkyDataGrid, SkyDataGridColumn, SkyPercentPipe],
  templateUrl: './docked-in-modal.component.html',
})
export class DockedInModalComponent {
  protected readonly columns = columnDefinitions;
  protected readonly data = data;
  protected readonly modalInstance = inject(SkyModalInstance);
}
