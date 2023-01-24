/* spell-checker:ignore lipsum */
import { NgModule } from '@angular/core';

import { DataManagerModule } from '../../../../shared/data-manager/data-manager.module';
import { LipsumModule } from '../../../../shared/lipsum/lipsum.module';

import { DataManagerFlyoutComponent } from './data-manager-flyout.component';

@NgModule({
  declarations: [DataManagerFlyoutComponent],
  imports: [LipsumModule, DataManagerModule],
  exports: [DataManagerFlyoutComponent],
})
export class DataManagerFlyoutModule {}
