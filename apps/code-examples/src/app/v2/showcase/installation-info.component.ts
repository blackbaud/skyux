import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkyDocsClipboardModule } from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyManifestDocumentationGroupDetails } from '@skyux/manifest/src/types/manifest';

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
    @let detailsValue = details();

    <sky-description-list>
      <sky-description-list-content>
        <sky-description-list-term> NPM package </sky-description-list-term>
        <sky-description-list-description>
          <code class="sky-codespan sky-margin-inline-sm">{{
            detailsValue.packageName
          }}</code>
          <a [attr.href]="detailsValue.registryUrl">View in NPM</a
          ><span> | </span
          ><a [attr.href]="detailsValue.repoUrl">View in GitHub</a>
        </sky-description-list-description>
      </sky-description-list-content>
      <sky-description-list-content>
        <sky-description-list-term>
          Install with NPM
        </sky-description-list-term>
        <sky-description-list-description>
          <code
            class="sky-codespan sky-margin-inline-sm sky-margin-stacked-sm"
            #installationRef
          >
            {{ peersInstallCommand() }} </code
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
  public readonly details =
    input.required<SkyManifestDocumentationGroupDetails>();

  protected peersInstallCommand = computed(() => {
    const details = this.details();

    const skyuxPackages = `@skyux/{${details.packageName.replace('@skyux/', '')},${Object.entries(
      details.peerDependencies,
    )
      .filter(([packageName]) => packageName.startsWith('@skyux/'))
      .map(([packageName]) => packageName.replace('@skyux/', ''))
      .join(',')}}@${details.packageVersion}`;

    return (
      `npm install --save-exact ${skyuxPackages} ` +
      Object.entries(details.peerDependencies)
        .filter(([packageName]) => !packageName.startsWith('@skyux/'))
        .map(([packageName, version]) => {
          return `${packageName}@${version}`;
        })
        .join(' ')
    );
  });
}
