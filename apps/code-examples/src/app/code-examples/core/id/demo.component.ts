import { Component } from '@angular/core';
import { SkyIdModule } from '@skyux/core';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyIdModule],
})
export class DemoComponent {}
