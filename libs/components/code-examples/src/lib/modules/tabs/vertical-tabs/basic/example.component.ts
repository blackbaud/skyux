import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

/**
 * @title Vertical tabs with basic setup
 */
@Component({
  selector: 'app-tabs-vertical-tabs-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyVerticalTabsetModule],
})
export class TabsVerticalTabsBasicExampleComponent {}
