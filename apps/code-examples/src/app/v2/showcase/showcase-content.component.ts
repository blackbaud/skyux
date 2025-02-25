import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-showcase-content',
  template: `<ng-content />`,
})
export class SkyShowcaseContentComponent {
  public category = input.required<
    'design' | 'development' | 'testing' | 'examples'
  >();
}
