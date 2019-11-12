import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-module-info',
  templateUrl: './module-info.component.html',
  styleUrls: ['./module-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsModuleInfoComponent {

  @Input()
  public gitRepoUrl: string;

  @Input()
  public moduleName: string;

  @Input()
  public packageName: string;

  @Input()
  public set packageUrl(value: string) {
    this._packageUrl = value;
  }

  public get packageUrl() {
    if (this._packageUrl) {
      return this._packageUrl;
    }

    if (this.packageName) {
      return `https://npmjs.org/package/${this.packageName}`;
    }

    return '';
  }

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

  private _packageUrl: string;
}
