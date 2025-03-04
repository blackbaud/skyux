import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
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
    @let packageInfoValue = packageInfo();

    <sky-description-list>
      <sky-description-list-content>
        <sky-description-list-term> NPM package </sky-description-list-term>
        <sky-description-list-description>
          <code class="sky-codespan sky-margin-inline-sm">{{
            packageInfoValue.packageName
          }}</code>
          <a [attr.href]="packageInfoValue.registryUrl">View in NPM</a
          ><span> | </span
          ><a [attr.href]="packageInfoValue.repoUrl">View in GitHub</a>
        </sky-description-list-description>
      </sky-description-list-content>
      <sky-description-list-content
        [helpPopoverContent]="
          'The following command will install the ' +
          packageInfoValue.packageName +
          ' NPM package and its peer dependencies. Run this command in the context of an Angular CLI project.'
        "
      >
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
  public readonly packageInfo =
    input.required<SkyManifestDocumentationGroupPackageInfo>();

  protected peersInstallCommand = computed(() => {
    const packageInfo = this.packageInfo();

    const skyuxPackages = [
      packageInfo.packageName.replace('@skyux/', ''),
      ...Object.entries(packageInfo.peerDependencies)
        .filter(([packageName]) => packageName.startsWith('@skyux/'))
        .map(([packageName]) => packageName.replace('@skyux/', '')),
    ];

    const skyuxPackagesFormatted =
      skyuxPackages.length === 1
        ? `${packageInfo.packageName}@${packageInfo.packageVersion}`
        : `@skyux/{${skyuxPackages.join(',')}}@${packageInfo.packageVersion}`;

    const thirdPartyPackages = Object.entries(packageInfo.peerDependencies)
      .filter(([packageName]) => !packageName.startsWith('@skyux/'))
      .map(([packageName, version]) => `${packageName}@${version}`);

    return (
      `npm install --save-exact ` +
      [skyuxPackagesFormatted, ...thirdPartyPackages].join(' ')
    );
  });
}
