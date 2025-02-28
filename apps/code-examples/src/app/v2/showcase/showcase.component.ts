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
  SkyDocsCodeExampleViewerModule,
  SkyTableOfContentsModule,
} from '@skyux/docs-tools';
import { SkyManifestDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyTypeAnchorIdsService } from '../type-definition/pipes/type-anchor-ids.service';
import { SkyTypeDefinitionComponent } from '../type-definition/type-definition.component';

import { SKY_SHOWCASE_EXAMPLES } from './examples-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    SkyDocsCodeExampleViewerModule,
    SkyTabsModule,
    SkyTypeDefinitionComponent,
    TitleCasePipe,
    SkyTableOfContentsModule,
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
  `,
  template: `
    @let developmentDefinitions = manifest().publicApi;
    @let testingDefinitions = manifest().testing;

    <sky-tabset permalinkId="docs">
      <sky-tab tabHeading="Design">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=design]" />
        </div>
      </sky-tab>

      @if (developmentDefinitions.length > 0) {
        <sky-tab tabHeading="Development">
          <sky-toc-page
            class="sky-showcase-tab-content"
            [menuHeadingText]="(labelText() | titlecase) + ' Development'"
          >
            <ng-content select="sky-showcase-content[category=development]" />

            @for (
              definition of developmentDefinitions;
              track definition.docsId
            ) {
              <sky-type-definition [definition]="definition" />
            }
          </sky-toc-page>
        </sky-tab>
      }

      @if (testingDefinitions.length > 0) {
        <sky-tab tabHeading="Testing">
          <sky-toc-page
            class="sky-showcase-tab-content"
            [menuHeadingText]="(labelText() | titlecase) + ' Testing'"
          >
            <ng-content select="sky-showcase-content[category=testing]" />

            @for (definition of testingDefinitions; track definition.docsId) {
              <sky-type-definition [definition]="definition" />
            }
          </sky-toc-page>
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
