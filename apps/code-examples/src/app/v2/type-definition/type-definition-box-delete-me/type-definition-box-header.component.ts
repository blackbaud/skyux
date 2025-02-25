import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-md sky-border-bottom-dark',
  },
  selector: 'sky-type-definition-box-header',
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      border-radius: 5px 5px 0 0;
      background-color: var(--sky-background-color-disabled);
    }
  `,
  template: '<ng-content />',
})
export class SkyTypeDefinitionBoxHeaderComponent {}
