import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

/**
 * Renders a section within the control panel.
 * @example
 * ```markup
 * <sky-docs-demo-control-panel>
 *   <sky-docs-demo-control-panel-section>
 *     Section content here.
 *   </sky-docs-demo-control-panel-section>
 * </sky-docs-demo-control-panel>
 * ```
 */

@Component({
  selector: 'sky-docs-demo-control-panel-section',
  templateUrl: './demo-control-panel-section.component.html',
  styleUrls: ['./demo-control-panel-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoControlPanelSectionComponent { }
