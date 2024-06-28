import { Component } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyStatusIndicatorModule],
})
export class DemoComponent {}
