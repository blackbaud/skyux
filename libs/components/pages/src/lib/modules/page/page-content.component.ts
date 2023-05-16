import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-page-content',
  template: `<ng-content />`,
  styleUrls: ['./page-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyPageContentComponent {}
