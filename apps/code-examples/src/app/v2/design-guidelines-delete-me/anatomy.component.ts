import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';

import { SkyDocsThumbnailComponent } from './thumbnail/thumbnail.component';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyFluidGridModule, SkyDocsThumbnailComponent],
  selector: 'sky-docs-anatomy',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-row>
      <sky-column [screenSmall]="6" [screenMedium]="5" [screenLarge]="4">
        <ng-content select="sky-docs-anatomy-item" />
      </sky-column>
      <sky-column [screenSmall]="6" [screenMedium]="7" [screenLarge]="8">
        <sky-docs-thumbnail [imageSrc]="imagePath()" />
      </sky-column>
    </sky-row>
  `,
})
export class SkyDocsAnatomyComponent {
  public readonly imagePath = input.required<string>();
}
// TODO: Maybe put all of the "design guideline stuff" in the docs REPO.
// Only provide tools it will need to build the components.
