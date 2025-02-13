import { JsonPipe } from '@angular/common';
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

import { SkyTypeDefinitionComponent } from '../type-definition/type-definition.component';

import { SKY_SHOWCASE_EXAMPLES } from './examples-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    SkyCodeExampleViewerModule,
    SkyTabsModule,
    SkyTypeDefinitionComponent,
  ],
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
    <sky-tabset permalinkId="docs">
      <sky-tab tabHeading="Design">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=design]" />
        </div>
      </sky-tab>

      <sky-tab tabHeading="Development">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=development]" />
          @for (definition of manifest().publicApi; track definition.docsId) {
            <sky-type-definition [definition]="definition" />
          }
          <pre>{{ manifest().publicApi | json }}</pre>
        </div>
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
            <sky-example-viewer
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

  public manifest = input.required<SkyManifestDocumentationGroup>();

  protected getComponentType(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
