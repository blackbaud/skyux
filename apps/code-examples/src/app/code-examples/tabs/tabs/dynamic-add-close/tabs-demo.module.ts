import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

import { TabsDemoComponent } from './tabs-demo.component';

@NgModule({
  imports: [CommonModule, SkyTabsModule],
  declarations: [TabsDemoComponent],
  exports: [TabsDemoComponent],
})
export class TabsDemoModule {}
