import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyPercentPipe } from '@skyux/core';
import {
  SkyDataGrid,
  SkyDataGridColumn,
  SkyDataGridSort,
} from '@skyux/data-grid';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageHeaderModule, SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';
import { LipsumComponent } from '../../../shared/lipsum/lipsum.component';

@Component({
  selector: 'app-fit-tabs',
  imports: [
    LipsumComponent,
    SkyBoxModule,
    SkyDataGridColumn,
    SkyDataGrid,
    SkyFluidGridModule,
    SkyPageHeaderModule,
    SkyPageModule,
    SkyTabsModule,
    RouterLink,
    SkyPercentPipe,
  ],
  styleUrl: './fit-tabs.component.css',
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
  protected readonly sortBy = signal<SkyDataGridSort>({
    field: 'name',
    direction: 'asc',
  });
}
export default FitTabsComponent;
