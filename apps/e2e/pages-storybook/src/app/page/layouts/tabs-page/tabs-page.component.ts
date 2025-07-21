import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { LinksComponent } from '../../../shared/links/links.component';

@Component({
  selector: 'app-tabs-page',
  imports: [SkyPageModule, SkyTabsModule, SkyToolbarModule, LinksComponent],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabsPageComponent {
  public readonly showLinks = input<boolean>(false);
}
