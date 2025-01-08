import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyIconModule, SkyToolbarModule],
})
export class DemoComponent {
  protected onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
