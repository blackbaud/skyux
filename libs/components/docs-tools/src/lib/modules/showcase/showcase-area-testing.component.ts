import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyDocsTableOfContentsModule } from '../table-of-contents/table-of-contents.module';
import { SkyDocsTypeDefinitionModule } from '../type-definition/type-definition.module';

import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * Content for the "Testing" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDocsTableOfContentsModule, SkyDocsTypeDefinitionModule],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-testing',
  styles: `
    :host {
      display: block;
      padding-top: var(--sky-padding-even-xl);
    }

    .sky-docs-showcase-section {
      padding-bottom: var(--sky-padding-even-xl);

      &:empty {
        display: none;
      }
    }
  `,
  templateUrl: './showcase-area-testing.component.html',
})
export class SkyDocsShowcaseAreaTestingComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly documentationGroup = toSignal(
    this.#hostSvc.documentationGroup,
  );
}
