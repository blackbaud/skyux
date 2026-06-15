import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyChart } from '@skyux/charts';
import { SkyPageModule } from '@skyux/pages';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChart, SkyPageModule],
  selector: 'app-chart',
  templateUrl: './chart-playground.html',
})
export default class ChartPlayground {}
