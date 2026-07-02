import { Component } from '@angular/core';
import { SkyChart } from '@skyux/charts';
import { SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  imports: [SkyBoxModule, SkyChart, SkyPageModule],
  selector: 'app-chart',
  templateUrl: './chart-playground.html',
})
export default class ChartPlayground {}
