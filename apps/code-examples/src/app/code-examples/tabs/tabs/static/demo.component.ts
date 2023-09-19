import { Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyTabsModule],
})
export class DemoComponent {}
