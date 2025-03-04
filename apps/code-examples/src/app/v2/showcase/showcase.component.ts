import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { SkyDocsTypeDefinitionAnchorIdsService } from '@skyux/docs-tools';
import { SkyManifestDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyDocsShowcaseAreaDevelopmentComponent } from './showcase-area-development.component';
import { SkyDocsShowcaseAreaExamplesComponent } from './showcase-area-examples.component';
import { SkyDocsShowcaseAreaOverviewComponent } from './showcase-area-overview.component';
import { SkyDocsShowcaseAreaTestingComponent } from './showcase-area-testing.component';
import { SkyDocsShowcaseHostService } from './showcase-host.service';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    SkyDocsShowcaseAreaDevelopmentComponent,
    SkyDocsShowcaseAreaExamplesComponent,
    SkyDocsShowcaseAreaTestingComponent,
    SkyTabsModule,
  ],
  providers: [
    SkyDocsTypeDefinitionAnchorIdsService,
    SkyDocsShowcaseHostService,
  ],
  selector: 'sky-docs-showcase',
  styles: `
    :host {
      display: block;
    }
  `,
  templateUrl: './showcase.component.html',
})
export class SkyDocsShowcaseComponent {
  readonly #manifestSvc = inject(SkyDocsShowcaseHostService);
  readonly #anchorSvc = inject(SkyDocsTypeDefinitionAnchorIdsService);

  public readonly labelText = input.required<string>();
  public readonly manifest = input.required<SkyManifestDocumentationGroup>();

  protected developmentContent = contentChild(
    SkyDocsShowcaseAreaDevelopmentComponent,
  );
  protected overviewContent = contentChild(
    SkyDocsShowcaseAreaOverviewComponent,
  );
  protected testingContent = contentChild(SkyDocsShowcaseAreaTestingComponent);

  constructor() {
    effect(() => {
      const manifest = this.manifest();
      const anchorIds: Record<string, string> = {};

      manifest.publicApi.forEach((def) => {
        anchorIds[def.name] = def.anchorId;
      });

      manifest.testing.forEach((def) => {
        anchorIds[def.name] = def.anchorId;
      });

      this.#anchorSvc.updateAnchorIds(anchorIds);
      this.#manifestSvc.updateGroup(manifest);
    });
  }
}
