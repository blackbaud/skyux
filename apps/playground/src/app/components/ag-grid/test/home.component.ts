import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { ListComponent } from './components/list.component';

@Component({
  imports: [SkyPageModule, SkyAlertModule, ListComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
