import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTabIndex } from '@skyux/tabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TabsComponent {
  protected showTab3 = true;
  protected tabIndexValue: SkyTabIndex = '2';

  protected onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
