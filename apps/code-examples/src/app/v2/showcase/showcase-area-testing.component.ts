import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDocsHeadingAnchorService,
  SkyDocsTableOfContentsModule,
} from '@skyux/docs-tools';

import { SkyDocsTypeDefinitionModule } from '../type-definition/type-definition.module';

import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [SkyDocsTableOfContentsModule, SkyDocsTypeDefinitionModule],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-testing',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-docs-toc-page menuHeadingText="Testing">
      <ng-content />

      @if (groupChange()?.testing; as definitions) {
        @for (definition of definitions; track definition.docsId) {
          <sky-docs-type-definition [definition]="definition" />
        }
      }
    </sky-docs-toc-page>
  `,
})
export class SkyDocsShowcaseAreaTestingComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly groupChange = toSignal(this.#hostSvc.documentationGroup);
}
