import { JsonPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
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
import { SkyTypeDefinitionComponent } from '../type-definition/type-definition.component';

import { SKY_SHOWCASE_EXAMPLES } from './examples-token';
import { SkyDocsInstallationInfoComponent } from './installation-info.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    SkyDescriptionListModule,
    SkyDocsCodeExampleViewerModule,
    SkyDocsHeadingAnchorModule,
    SkyIconModule,
    SkyTabsModule,
    SkyTypeDefinitionComponent,
    SkyDocsClipboardModule,
    TitleCasePipe,
    SkyDocsTableOfContentsModule,
    SkyBoxModule,
    SkyDocsInstallationInfoComponent,
  ],
  providers: [SkyTypeAnchorIdsService],
  selector: 'sky-showcase',
  styles: `
    :host {
      display: block;
    }

    .sky-showcase-tab-content {
      padding-top: 30px;
    }

    .sky-docs-showcase-box-heading {
      margin-top: 0;
    }
  `,
  template: `
    @let developmentDefinitions = manifest().publicApi;
    @let testingDefinitions = manifest().testing;
    @let packageInfo = manifest().packageInfo;

    <sky-tabset permalinkId="docs">
      <sky-tab tabHeading="Design">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=design]" />
        </div>
      </sky-tab>

      @if (developmentDefinitions.length > 0) {
        <sky-tab tabHeading="Development">
          <sky-docs-toc-page
            class="sky-showcase-tab-content"
            [menuHeadingText]="(labelText() | titlecase) + ' Development'"
          >
            <div
              class="sky-elevation-0-bordered sky-rounded-corners sky-margin-stacked-xxl sky-padding-even-xl"
            >
              <sky-docs-heading-anchor
                anchorId="installation"
                class="sky-margin-stacked-lg"
                headingText="Installation"
              />

              <sky-docs-installation-info [packageInfo]="packageInfo" />
            </div>

            <ng-content select="sky-showcase-content[category=development]" />

            @for (
              definition of developmentDefinitions;
              track definition.docsId
            ) {
              <sky-docs-type-definition [definition]="definition" />
            }
          </sky-docs-toc-page>
        </sky-tab>
      }

      @if (testingDefinitions.length > 0) {
        <sky-tab tabHeading="Testing">
          <sky-docs-toc-page
            class="sky-showcase-tab-content"
            [menuHeadingText]="(labelText() | titlecase) + ' Testing'"
          >
            <ng-content select="sky-showcase-content[category=testing]" />

            @for (definition of testingDefinitions; track definition.docsId) {
              <sky-docs-type-definition [definition]="definition" />
            }
          </sky-docs-toc-page>
        </sky-tab>
      }

      <sky-tab tabHeading="Examples">
        <!-- TODO: DON"T LOAD THIS TAB UNTIL IT"S CLICKED! -->

        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=examples]" />

          @for (
            example of manifest().codeExamples;
            track example.componentName;
            let last = $last
          ) {
            <sky-docs-code-example-viewer
              [componentName]="example.componentName"
              [componentSelector]="example.selector"
              [componentType]="getComponentType(example.componentName)"
              [demoHidden]="!!example.demoHidden"
              [files]="example.files"
              [headingText]="example.title || 'Example'"
              [primaryFile]="example.primaryFile"
              [stacked]="!last"
            />
          }
        </div>
      </sky-tab>
    </sky-tabset>
  `,
})
export class SkyShowcaseComponent {
  readonly #anchorSvc = inject(SkyTypeAnchorIdsService);
  readonly #examples = inject(SKY_SHOWCASE_EXAMPLES);

  public readonly labelText = input.required<string>();
  public readonly manifest = input.required<SkyManifestDocumentationGroup>();

  constructor() {
    effect(() => {
      const manifest = this.manifest();
      const anchorIds: Record<string, string> = {};

      manifest.publicApi.forEach((d) => {
        anchorIds[d.name] = d.anchorId;
      });

      manifest.testing.forEach((d) => {
        anchorIds[d.name] = d.anchorId;
      });

      this.#anchorSvc.setAnchorIds(anchorIds);
    });
  }

  protected getComponentType(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
