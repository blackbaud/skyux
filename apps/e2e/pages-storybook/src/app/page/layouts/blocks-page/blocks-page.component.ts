import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyLabelModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-blocks-page',
  standalone: true,
  imports: [
    CommonModule,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyLabelModule,
    SkyPageModule,
  ],
  templateUrl: './blocks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksPageComponent {}
