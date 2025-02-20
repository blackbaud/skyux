import { JsonPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
  inject,
  input,
} from '@angular/core';
import { SkyCodeExampleViewerModule } from '@skyux/docs-tools';
import { SkyManifestDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyTypeDefinitionComponent } from '../type-definition/type-definition.component';

import { SKY_SHOWCASE_EXAMPLES } from './examples-token';
import { SkyShowcasePanelComponent } from './showcase-panel.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    SkyCodeExampleViewerModule,
    SkyShowcasePanelComponent,
    SkyTabsModule,
    SkyTypeDefinitionComponent,
    TitleCasePipe,
  ],
  providers: [SkyHeadingAnchorService],
  selector: 'sky-showcase',
  styles: `
    :host {
      display: block;
    }

    pre {
      width: 100%;
      overflow: auto;
      border: 1px solid red;
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
          <sky-showcase-panel [tocHeadingText]="labelText() | titlecase">
            <ng-content select="sky-showcase-content[category=development]" />

            @for (
              definition of developmentDefinitions;
              track definition.docsId
            ) {
              <sky-type-definition [definition]="definition" />
            }
          </sky-showcase-panel>
        </sky-tab>
      }

      @if (testingDefinitions.length > 0) {
        <sky-tab tabHeading="Testing">
          <sky-showcase-panel
            [tocHeadingText]="(labelText() | titlecase) + ' Testing'"
          >
            <ng-content select="sky-showcase-content[category=testing]" />

            @for (definition of testingDefinitions; track definition.docsId) {
              <sky-type-definition [definition]="definition" />
            }
          </sky-showcase-panel>
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
            <sky-code-example-viewer
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
  readonly #examples = inject(SKY_SHOWCASE_EXAMPLES);

  public readonly labelText = input.required<string>();
  public readonly manifest = input.required<SkyManifestDocumentationGroup>();

  protected getComponentType(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
