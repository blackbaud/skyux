import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyHrefModule } from '@skyux/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyHrefModule],
})
export class DemoComponent {}
