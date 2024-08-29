import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { DataManagerVisualComponent } from '../../../ag-grid/data-manager/data-manager-visual.component';

@Component({
  standalone: true,
  imports: [DataManagerVisualComponent, SkyPageModule],
  templateUrl: './list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListPageComponent {}
