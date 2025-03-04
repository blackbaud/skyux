import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { SkyManifestDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyDocsTypeDefinitionAnchorIdsService } from '../type-definition/type-anchor-ids.service';

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
  readonly #anchorIdsSvc = inject(SkyDocsTypeDefinitionAnchorIdsService);
  readonly #showcaseHostSvc = inject(SkyDocsShowcaseHostService);

  public readonly manifest = input.required<SkyManifestDocumentationGroup>();

  protected readonly developmentContent = contentChild(
    SkyDocsShowcaseAreaDevelopmentComponent,
  );

  protected readonly overviewContent = contentChild(
    SkyDocsShowcaseAreaOverviewComponent,
  );

  protected readonly testingContent = contentChild(
    SkyDocsShowcaseAreaTestingComponent,
  );

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

      this.#anchorIdsSvc.updateAnchorIds(anchorIds);
      this.#showcaseHostSvc.updateGroup(manifest);
    });
  }
}
