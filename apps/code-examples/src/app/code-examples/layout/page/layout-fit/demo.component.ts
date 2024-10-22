import { Component } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [SkyFluidGridModule, SkyPageModule],
})
export class DemoComponent {}
