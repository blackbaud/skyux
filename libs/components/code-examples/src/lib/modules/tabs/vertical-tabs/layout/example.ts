import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

/**
 * @title Vertical tabs with layout options
 */
@Component({
  selector: 'app-tabs-vertical-tabs-layout-example',
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyVerticalTabsetModule],
})
export class TabsVerticalTabsLayoutExample {}
