import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';

@Component({
  selector: 'app-layout-toolbar-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyIconModule, SkyToolbarModule],
})
export class LayoutToolbarBasicExampleComponent {
  public onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
