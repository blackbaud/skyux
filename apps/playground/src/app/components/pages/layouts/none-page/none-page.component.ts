import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

@Component({
  standalone: true,
  imports: [SkyPageModule],
  templateUrl: './none-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NonePageComponent {}
