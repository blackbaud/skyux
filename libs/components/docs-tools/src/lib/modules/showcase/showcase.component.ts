import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { getDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyDocsTypeDefinitionAnchorIdsService } from '../type-definition/type-anchor-ids.service';

import { SkyDocsShowcaseAreaDevelopmentComponent } from './showcase-area-development.component';
import { SkyDocsShowcaseAreaExamplesComponent } from './showcase-area-examples.component';
import { SkyDocsShowcaseAreaHighlightComponent } from './showcase-area-highlight.component';
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

  public readonly groupName = input.required<string>();
  public readonly packageName = input.required<string>();

  protected docsGroup = computed(() => {
    const groupName = this.groupName();
    const packageName = this.packageName();

    try {
      const group = getDocumentationGroup(packageName, groupName);
      return group;
    } catch {
      return;
    }
  });

  protected readonly developmentContent = contentChild(
    SkyDocsShowcaseAreaDevelopmentComponent,
  );

  protected readonly highlightContent = contentChild(
    SkyDocsShowcaseAreaHighlightComponent,
  );

  protected readonly overviewContent = contentChild(
    SkyDocsShowcaseAreaOverviewComponent,
  );

  protected readonly testingContent = contentChild(
    SkyDocsShowcaseAreaTestingComponent,
  );

  constructor() {
    effect(() => {
      const docsGroup = this.docsGroup();
      const anchorIds: Record<string, string> = {};

      docsGroup?.publicApi.forEach((def) => {
        anchorIds[def.name] = def.anchorId;
      });

      docsGroup?.testing.forEach((def) => {
        anchorIds[def.name] = def.anchorId;
      });

      this.#anchorIdsSvc.updateAnchorIds(anchorIds);
      this.#showcaseHostSvc.updateGroup(docsGroup);
    });
  }
}
