import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { DataManagerVisualComponent } from '../../../ag-grid/data-manager/data-manager-visual.component';

@Component({
  standalone: true,
  imports: [CommonModule, DataManagerVisualComponent, SkyPageModule],
  templateUrl: './list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListPageComponent {}
