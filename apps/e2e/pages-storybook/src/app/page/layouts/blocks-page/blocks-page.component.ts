import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

import { LinksComponent } from '../../../shared/links/links.component';

@Component({
  selector: 'app-blocks-page',
  standalone: true,
  imports: [
    CommonModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyLabelModule,
    SkyPageModule,
    LinksComponent,
  ],
  templateUrl: './blocks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksPageComponent {
  public readonly showLinks = input<boolean>(false);
}
