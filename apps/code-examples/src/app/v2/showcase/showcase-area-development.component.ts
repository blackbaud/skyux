import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDocsClipboardModule,
  SkyDocsHeadingAnchorModule,
  SkyDocsHeadingAnchorService,
  SkyDocsTableOfContentsModule,
} from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyDescriptionListModule } from '@skyux/layout';

import { SkyDocsTypeDefinitionModule } from '../type-definition/type-definition.module';

import { SkyDocsShowcaseHostService } from './showcase-host.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-padding-even-xl',
  },
  imports: [
    SkyDescriptionListModule,
    SkyDocsClipboardModule,
    SkyDocsHeadingAnchorModule,
    SkyDocsTableOfContentsModule,
    SkyDocsTypeDefinitionModule,
    SkyIconModule,
  ],
  providers: [SkyDocsHeadingAnchorService],
  selector: 'sky-docs-showcase-area-development',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-docs-toc-page menuHeadingText="Development">
      @if (groupChange()?.packageInfo; as packageInfo) {
        <div class="sky-margin-stacked-xxl">
          <sky-docs-heading-anchor
            anchorId="installation"
            class="sky-margin-stacked-lg"
            headingText="Installation"
          />
          <sky-description-list>
            <sky-description-list-content>
              <sky-description-list-term>
                NPM package
              </sky-description-list-term>
              <sky-description-list-description>
                <code class="sky-codespan sky-margin-inline-sm">{{
                  packageInfo.packageName
                }}</code>
                <a [attr.href]="packageInfo.registryUrl">View in NPM</a
                ><span> | </span
                ><a [attr.href]="packageInfo.repoUrl">View in GitHub</a>
              </sky-description-list-description>
            </sky-description-list-content>
            <sky-description-list-content
              helpPopoverContent="To use this module, you must install peer dependencies along with its package. Also, after you install the package, you must add the module as an export in your SPA's main module to make exports available to your SPA."
            >
              <sky-description-list-term>
                Install with NPM
              </sky-description-list-term>
              <sky-description-list-description>
                <code
                  class="sky-codespan sky-margin-inline-sm sky-margin-stacked-sm"
                  #installationRef
                >
                  npm install --save-exact {{ packageInfo.packageName }}
                </code>
                <button
                  class="sky-btn sky-btn-default"
                  type="button"
                  skyDocsClipboardButton
                  copySuccessMessage="Command copied"
                  [clipboardTarget]="installationRef"
                >
                  <sky-icon iconName="clipboard-multiple" />
                  Copy
                </button>
              </sky-description-list-description>
            </sky-description-list-content>
          </sky-description-list>
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
export class SkyDocsShowcaseAreaDevelopmentComponent {
  readonly #hostSvc = inject(SkyDocsShowcaseHostService);

  protected readonly groupChange = toSignal(this.#hostSvc.documentationGroup);
}
