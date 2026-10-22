import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * @title Toolbar with sections
 */
@Component({
  selector: 'app-layout-toolbar-sectioned-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton, SkyToolbarModule],
})
export class LayoutToolbarSectionedExampleComponent {
  public onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
