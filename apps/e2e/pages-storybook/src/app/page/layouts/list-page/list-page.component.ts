import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import { LinksComponent } from '../../../shared/links/links.component';

@Component({
  selector: 'app-list-page',
  imports: [CommonModule, SkyPageModule, SkyToolbarModule, LinksComponent],
  templateUrl: './list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListPageComponent {
  public readonly showLinks = input<boolean>(false);
}
