import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-blocks-page',
  standalone: true,
  imports: [
    CommonModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyLabelModule,
    SkyPageModule,
  ],
  templateUrl: './blocks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksPageComponent {}
