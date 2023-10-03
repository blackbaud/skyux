import { Component } from '@angular/core';
import { SkyFormatModule } from '@skyux/layout';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [SkyFormatModule],
})
export class DemoComponent {}
