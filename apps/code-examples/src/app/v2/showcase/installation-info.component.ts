import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyDocsClipboardModule } from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyManifestDocumentationGroupPackageInfo } from '@skyux/manifest';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDescriptionListModule, SkyDocsClipboardModule, SkyIconModule],
  selector: 'sky-docs-installation-info',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-description-list>
      <sky-description-list-content>
        <sky-description-list-term> NPM package </sky-description-list-term>
        <sky-description-list-description>
          <code class="sky-codespan sky-margin-inline-sm">{{
            packageInfo().packageName
          }}</code>
          <a [attr.href]="packageInfo().registryUrl">View in NPM</a
          ><span> | </span
          ><a [attr.href]="packageInfo().repoUrl">View in GitHub</a>
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
            npm install --save-exact {{ packageInfo().packageName }} </code
          ><br />
          <button
            class="sky-btn sky-btn-default"
            type="button"
            skyDocsClipboardButton
            copySuccessMessage="Command copied"
            [clipboardTarget]="installationRef"
          >
            <sky-icon iconName="clipboard-multiple" />
            Copy installation command
          </button>
        </sky-description-list-description>
      </sky-description-list-content>
    </sky-description-list>
  `,
})
export class SkyDocsInstallationInfoComponent {
  public readonly packageInfo =
    input.required<SkyManifestDocumentationGroupPackageInfo>();
}
