import { Component } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyIdModule, SkyInputBoxModule],
})
export class DemoComponent {}
