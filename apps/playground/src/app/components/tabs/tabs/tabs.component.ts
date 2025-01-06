import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TabsComponent {
  public newTabClick() {}

  public openTabClick() {}

  public closeTab() {}
}
