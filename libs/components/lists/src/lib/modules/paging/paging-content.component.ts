import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-paging-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ng-content />`,
})
export class SkyPagingContentComponent {}
