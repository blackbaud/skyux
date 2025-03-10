import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

import { LinksComponent } from '../../../shared/links/links.component';

@Component({
  selector: 'app-blocks-page',
  imports: [
    CommonModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyLabelModule,
    SkyPageModule,
    LinksComponent,
  ],
  templateUrl: './blocks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksPageComponent {
  public readonly hideAlert = input<boolean>(false);
  public readonly hideAvatar = input<boolean>(false);
  public readonly showLinks = input<boolean>(false);
}
