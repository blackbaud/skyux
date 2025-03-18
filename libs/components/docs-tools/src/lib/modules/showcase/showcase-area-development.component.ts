import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyIconModule } from '@skyux/icon';
import { SkyDescriptionListModule } from '@skyux/layout';

import { SkyDocsClipboardModule } from '../clipboard/clipboard.module';
import { SkyDocsHeadingAnchorModule } from '../heading-anchor/heading-anchor.module';
import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyDocsTableOfContentsModule } from '../table-of-contents/table-of-contents.module';
import { SkyDocsTypeDefinitionModule } from '../type-definition/type-definition.module';

import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * Content for the "Development" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDescriptionListModule,
    SkyDocsClipboardModule,
    SkyDocsHeadingAnchorModule,
    SkyDocsTableOfContentsModule,
    SkyDocsTypeDefinitionModule,
    SkyIconModule,
  ],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-development',
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
  templateUrl: './showcase-area-development.component.html',
})
export class SkyDocsShowcaseAreaDevelopmentComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly documentationGroup = toSignal(
    this.#hostSvc.documentationGroup,
  );
}
