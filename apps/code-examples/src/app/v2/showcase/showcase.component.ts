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
    <sky-tabset permalinkId="docs">
      <sky-tab tabHeading="Design">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=design]" />
        </div>
      </sky-tab>

      <sky-tab tabHeading="Development">
        <sky-showcase-panel
          [headingText]="(headingText() | titlecase) + ' Development'"
          [scrollContainerSelector]="scrollContainerSelector()"
        >
          <ng-content select="sky-showcase-content[category=development]" />

          @for (definition of manifest().publicApi; track definition.docsId) {
            <sky-type-definition [definition]="definition" />
          }

          <pre>{{ manifest().publicApi | json }}</pre>
        </sky-showcase-panel>
      </sky-tab>

      <sky-tab tabHeading="Testing">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=testing]" />
          <pre>{{ manifest().testing | json }}</pre>
        </div>
      </sky-tab>

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

  public headingText = input.required<string>();
  public manifest = input.required<SkyManifestDocumentationGroup>();
  public scrollContainerSelector = input<string | undefined>(undefined);

  protected getComponentType(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
