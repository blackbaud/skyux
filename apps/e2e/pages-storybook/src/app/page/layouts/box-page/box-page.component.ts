import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  selector: 'app-box-page',
  standalone: true,
  imports: [CommonModule, SkyBoxModule, SkyFluidGridModule, SkyPageModule],
  templateUrl: './box-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BoxPageComponent {}
