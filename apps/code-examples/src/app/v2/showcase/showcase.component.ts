import { JsonPipe, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  SkyDocsClipboardModule,
  SkyDocsCodeExampleViewerModule,
  SkyDocsHeadingAnchorModule,
  SkyDocsTableOfContentsModule,
} from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyBoxModule, SkyDescriptionListModule } from '@skyux/layout';
import { SkyManifestDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyTypeAnchorIdsService } from '../type-definition/pipes/type-anchor-ids.service';
import { SkyDocsTypeDefinitionModule } from '../type-definition/type-definition.module';

import { SkyDocsInstallationInfoComponent } from './installation-info.component';
import { SkyShowcaseAreaDevelopmentComponent } from './showcase-area-development.component';
import { SkyShowcaseAreaExamplesComponent } from './showcase-area-examples.component';
import { SkyShowcaseAreaOverviewComponent } from './showcase-area-overview.component';
import { SkyShowcaseAreaTestingComponent } from './showcase-area-testing.component';
import { SkyDocsShowcaseHostService } from './showcase-host.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgTemplateOutlet,
    SkyDescriptionListModule,
    SkyDocsCodeExampleViewerModule,
    SkyDocsHeadingAnchorModule,
    SkyIconModule,
    SkyTabsModule,
    SkyDocsTypeDefinitionModule,
    SkyDocsClipboardModule,
    TitleCasePipe,
    SkyDocsTableOfContentsModule,
    SkyBoxModule,
    SkyDocsInstallationInfoComponent,
    SkyShowcaseAreaDevelopmentComponent,
    SkyShowcaseAreaExamplesComponent,
    SkyShowcaseAreaOverviewComponent,
    SkyShowcaseAreaTestingComponent,
  ],
  providers: [SkyTypeAnchorIdsService, SkyDocsShowcaseHostService],
  selector: 'sky-showcase',
  styles: `
    :host {
      display: block;
    }
  `,
  templateUrl: './showcase.component.html',
})
export class SkyShowcaseComponent {
  readonly #manifestSvc = inject(SkyDocsShowcaseHostService);
  readonly #anchorSvc = inject(SkyTypeAnchorIdsService);

  public readonly labelText = input.required<string>();
  public readonly manifest = input.required<SkyManifestDocumentationGroup>();

  protected developmentContent = contentChild(
    SkyShowcaseAreaDevelopmentComponent,
  );
  protected overviewContent = contentChild(SkyShowcaseAreaOverviewComponent);
  protected testingContent = contentChild(SkyShowcaseAreaTestingComponent);

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
