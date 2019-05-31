import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-docs-demo-control-panel-section',
  templateUrl: './demo-control-panel-section.component.html',
  styleUrls: ['./demo-control-panel-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoControlPanelSectionComponent { }
