import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyDatePipeModule } from '@skyux/datetime';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import {
  SkyBoxModule,
  SkyDescriptionListModule,
  SkyFluidGridModule,
} from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

import { LinksComponent } from '../../../shared/links/links.component';

@Component({
  selector: 'app-blocks-page',
  imports: [
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyDescriptionListModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyLabelModule,
    SkyPageModule,
    LinksComponent,
    SkyDatePipeModule,
  ],
  templateUrl: './blocks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksPageComponent {
  public readonly hideActions = input<boolean>(false);
  public readonly hideAlert = input<boolean>(false);
  public readonly hideAvatar = input<boolean>(false);
  public readonly showLinks = input<boolean>(false);
  public readonly showDescriptionList = input<boolean>(false);

  protected readonly date = new Date(2023, 9, 1);
}
