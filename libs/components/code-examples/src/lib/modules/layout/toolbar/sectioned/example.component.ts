import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * @title Toolbar with sections
 */
@Component({
  selector: 'app-layout-toolbar-sectioned-example',
  templateUrl: './example.component.html',
  imports: [SkyIconModule, SkyToolbarModule],
})
export class LayoutToolbarSectionedExampleComponent {
  public onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
