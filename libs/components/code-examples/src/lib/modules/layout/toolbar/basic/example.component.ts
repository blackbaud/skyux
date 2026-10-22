import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * @title Toolbar with basic setup
 */
@Component({
  selector: 'app-layout-toolbar-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton, SkyToolbarModule],
})
export class LayoutToolbarBasicExampleComponent {
  public onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
