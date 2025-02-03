import { Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-tabs-static-add-close-example',
  templateUrl: './example.component.html',
  imports: [SkyTabsModule],
})
export class TabsStaticAddCloseExampleComponent {
  protected showTab3 = true;

  protected onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
