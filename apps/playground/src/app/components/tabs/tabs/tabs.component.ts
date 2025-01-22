import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  protected showTab3 = true;

  protected onNewTabClick(): void {
    alert('Add tab clicked!');
  }
}
