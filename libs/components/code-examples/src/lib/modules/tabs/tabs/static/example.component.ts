import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTabsModule } from '@skyux/tabs';

/**
 * @title Tabs with basic setup
 */
@Component({
  selector: 'app-tabs-static-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyTabsModule],
})
export class TabsStaticExampleComponent {}
