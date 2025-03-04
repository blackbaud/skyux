import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDocsHeadingAnchorService,
  SkyDocsTableOfContentsModule,
  SkyDocsTypeDefinitionModule,
} from '@skyux/docs-tools';

import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * Content for the "Testing" tab.
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
  templateUrl: './showcase-area-testing.component.html',
})
export class SkyDocsShowcaseAreaTestingComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly groupChange = toSignal(this.#hostSvc.documentationGroup);
}
