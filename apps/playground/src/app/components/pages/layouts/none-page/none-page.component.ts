import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

@Component({
  standalone: true,
  imports: [CommonModule, SkyPageModule],
  templateUrl: './none-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NonePageComponent {}
