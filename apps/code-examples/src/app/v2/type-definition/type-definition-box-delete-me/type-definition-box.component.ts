import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-elevation-0-bordered sky-rounded-corners sky-margin-stacked-lg',
  },
  selector: 'sky-type-definition-box',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-content select="sky-type-definition-box-header" />
    <div class="sky-padding-even-md">
      <ng-content />
    </div>
  `,
})
export class SkyTypeDefinitionBoxComponent {}
