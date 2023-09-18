import { Component } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyVerticalTabsetModule],
})
export class DemoComponent {}
