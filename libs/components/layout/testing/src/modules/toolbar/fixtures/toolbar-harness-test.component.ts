import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';

@Component({
  selector: 'sky-toolbar-fixture',
  templateUrl: './toolbar-harness-test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyIconModule, SkyToolbarModule],
})
export class ToolbarHarnessTestComponent {
  protected onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
