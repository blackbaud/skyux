import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDocsCodeExampleViewerModule,
  SkyDocsHeadingAnchorService,
} from '@skyux/docs-tools';

import { SkyDocsExampleNameToComponentTypePipe } from './component-type.pipe';
import { SkyDocsShowcaseHostService } from './showcase-host.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [
    SkyDocsExampleNameToComponentTypePipe,
    SkyDocsCodeExampleViewerModule,
  ],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-showcase-area-examples',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    @if (groupChange()?.codeExamples; as codeExamples) {
      @for (
        example of codeExamples;
        track example.componentName;
        let last = $last
      ) {
        <sky-docs-code-example-viewer
          [componentName]="example.componentName"
          [componentSelector]="example.selector"
          [componentType]="
            example.componentName | skyDocsExampleNameToComponentType
          "
          [demoHidden]="!!example.demoHidden"
          [files]="example.files"
          [headingText]="example.title || 'Example'"
          [primaryFile]="example.primaryFile"
          [stacked]="!last"
        />
      }
    }
  `,
})
export class SkyShowcaseAreaExamplesComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly groupChange = toSignal(this.#hostSvc.documentationGroup);
}
