import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { SplitViewContentComponent } from '../shared/split-view-content/split-view-content.component';

@Component({
  standalone: true,
  imports: [CommonModule, SkyPageModule, SplitViewContentComponent],
  templateUrl: './fit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FitPageComponent {}
