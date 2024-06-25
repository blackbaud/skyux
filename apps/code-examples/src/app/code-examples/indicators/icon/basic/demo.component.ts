import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyIconModule],
})
export class DemoComponent {}
