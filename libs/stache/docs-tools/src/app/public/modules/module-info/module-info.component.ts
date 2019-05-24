import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-demo-page-module-info',
  templateUrl: './module-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsModuleInfoComponent {

  @Input()
  public gitRepoUrl: string;

  @Input()
  public moduleName: string;

  @Input()
  public packageName: string;

  public get externalLinks(): { label: string; url: string; }[] {
    const externalLinks: { label: string; url: string; }[] = [];

    if (this.packageName) {
      externalLinks.push({
        url: this.packageUrl,
        label: 'View in NPM'
      });
    }

    if (this.gitRepoUrl) {
      externalLinks.push({
        url: this.gitRepoUrl,
        label: 'View in GitHub'
      });
    }

    return externalLinks;
  }

  public get installationCommand(): string {
    if (!this.packageName) {
      return '';
    }

    return `npm install --save-exact ${this.packageName}`;
  }

  public get packageUrl(): string {
    if (!this.packageName) {
      return '';
    }

    return `https://npmjs.org/packages/${this.packageName}`;
  }
}
