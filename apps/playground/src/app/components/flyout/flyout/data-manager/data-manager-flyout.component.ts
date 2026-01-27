import { Component } from '@angular/core';

import { DataManagerModule } from '../../../../shared/data-manager/data-manager.module';
import { LipsumComponent } from '../../../../shared/lipsum/lipsum.component';

@Component({
  selector: 'app-data-manager-flyout',
  templateUrl: './data-manager-flyout.component.html',
  imports: [DataManagerModule, LipsumComponent],
})
export class DataManagerFlyoutComponent {}
