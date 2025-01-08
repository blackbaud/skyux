import { Component } from '@angular/core';
import { SkyFluidGridModule, SkyPageModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [SkyFluidGridModule, SkyPageModule],
})
export class DemoComponent {}
