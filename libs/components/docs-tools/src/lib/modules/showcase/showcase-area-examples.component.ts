import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SkyDocsCodeExampleViewerModule } from '../code-example-viewer/code-example-viewer.module';
import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';

import { SkyDocsCodeExampleNameToComponentTypePipe } from './code-example-types/code-example-types.pipe';
import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * Content for the "Examples" tab.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDocsCodeExampleNameToComponentTypePipe,
    SkyDocsCodeExampleViewerModule,
  ],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-examples',
  styles: `
    :host {
      display: block;
      padding-top: var(--sky-padding-even-xl);
    }
  `,
  templateUrl: './showcase-area-examples.component.html',
})
export class SkyDocsShowcaseAreaExamplesComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly documentationGroup = toSignal(
    this.#hostSvc.documentationGroup,
  );
}
