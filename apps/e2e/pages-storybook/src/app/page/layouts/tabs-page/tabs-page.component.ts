import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-tabs-page',
  standalone: true,
  imports: [CommonModule, SkyPageModule, SkyTabsModule],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabsPageComponent {
  public readonly showLinks = input<boolean>(false);
}
