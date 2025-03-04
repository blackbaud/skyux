import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDocsHeadingAnchorModule,
  SkyDocsHeadingAnchorService,
  SkyDocsTableOfContentsModule,
} from '@skyux/docs-tools';

import { SkyDocsTypeDefinitionModule } from '../type-definition/type-definition.module';

import { SkyDocsInstallationInfoComponent } from './installation-info.component';
import { SkyDocsShowcaseHostService } from './showcase-host.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [
    SkyDocsTableOfContentsModule,
    SkyDocsTypeDefinitionModule,
    SkyDocsInstallationInfoComponent,
    TitleCasePipe,
    SkyDocsHeadingAnchorModule,
  ],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-showcase-area-development',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-docs-toc-page menuHeadingText="Development">
      @if (groupChange()?.packageInfo; as packageInfo) {
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
      }

      <ng-content />

      @if (groupChange()?.publicApi; as definitions) {
        @for (definition of definitions; track definition.docsId) {
          <sky-docs-type-definition [definition]="definition" />
        }
      }
    </sky-docs-toc-page>
  `,
})
export class SkyShowcaseAreaDevelopmentComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly groupChange = toSignal(this.#hostSvc.documentationGroup);
}
