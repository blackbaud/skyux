import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Type,
  inject,
  input,
} from '@angular/core';
import { SkyManifestDocumentationGroup } from '@skyux/manifest';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyExampleViewerComponent } from '../example-viewer/example-viewer.component';

import { SKY_SHOWCASE_EXAMPLES } from './examples-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, SkyExampleViewerComponent, SkyTabsModule],
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
    <sky-tabset>
      <sky-tab tabHeading="Design">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=design]" />
        </div>
      </sky-tab>

      <sky-tab tabHeading="Development">
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=development]" />
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
        <div class="sky-showcase-tab-content">
          <ng-content select="sky-showcase-content[category=examples]" />

          @for (
            example of manifest().codeExamples;
            track example.componentName
          ) {
            <sky-example-viewer
              [componentName]="example.componentName"
              [componentSelector]="example.selector"
              [componentType]="getComponentType(example.componentName)"
              [demoHidden]="!!example.demoHidden"
              [files]="example.files"
              [primaryFile]="example.primaryFile"
              [title]="example.title || 'Example'"
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
