import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDocsClipboardModule,
  SkyDocsHeadingAnchorModule,
  SkyDocsHeadingAnchorService,
  SkyDocsTableOfContentsModule,
  SkyDocsTypeDefinitionModule,
} from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyDescriptionListModule } from '@skyux/layout';

import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * Content for the "Development" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
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
    }
  `,
  templateUrl: './showcase-area-development.component.html',
})
export class SkyDocsShowcaseAreaDevelopmentComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly groupChange = toSignal(this.#hostSvc.documentationGroup);
}
