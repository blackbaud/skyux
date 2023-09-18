import { Component } from '@angular/core';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyProgressIndicatorModule],
})
export class DemoComponent {}
