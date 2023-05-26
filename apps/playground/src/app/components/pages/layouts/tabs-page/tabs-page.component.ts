import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { SplitViewContentComponent } from '../shared/split-view-content/split-view-content.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SkyPageModule,
    SkyTabsModule,
    SplitViewContentComponent,
  ],
  templateUrl: './tabs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabsPageComponent {}
