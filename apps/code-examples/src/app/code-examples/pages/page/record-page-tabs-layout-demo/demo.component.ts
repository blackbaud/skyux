import { Component } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule, SkyLabelModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageContentComponent } from './record-page-content.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    RecordPageContentComponent,
    SkyAlertModule,
    SkyAvatarModule,
    SkyLabelModule,
    SkyPageModule,
  ],
})
export class DemoComponent {}
