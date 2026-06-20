import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
  SkyDataGridSort,
} from '@skyux/data-grid';
import { SkyPageHeaderModule, SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';
import {
  DataType,
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';

@Component({
  selector: 'app-fit-tabs',
  imports: [
    SkyDataGridColumnComponent,
    SkyDataGridComponent,
    SkyPageHeaderModule,
    SkyPageModule,
    SkyTabsModule,
    RouterLink,
  ],
  templateUrl: './fit-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FitTabsComponent {
  protected readonly columns = columnDefinitions;
  protected readonly dataAM = data.filter(
    (player) => player.name.charAt(0) <= 'M',
  );
  protected readonly dataNZ = data.filter(
    (player) => player.name.charAt(0) > 'M',
  );
  protected readonly activeTabIndex = signal('am');
  protected readonly sortBy = signal<SkyDataGridSort<DataType>>({
    fieldSelector: 'name',
    descending: false,
  });
}
export default FitTabsComponent;
