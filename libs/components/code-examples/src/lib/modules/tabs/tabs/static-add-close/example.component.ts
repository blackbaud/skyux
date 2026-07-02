import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

/**
 * @title Tabs with add and close buttons
 */
@Component({
  selector: 'app-tabs-static-add-close-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyTabsModule],
})
export class TabsStaticAddCloseExampleComponent {
  protected showTab3 = true;

  public onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
