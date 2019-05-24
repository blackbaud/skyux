import {
  Component,
  Input
} from '@angular/core';
import { SkyDocsCodeExampleModuleDependencies } from './code-example-module-dependencies';

@Component({
  selector: 'sky-docs-code-example',
  template: ''
})
export class SkyDocsCodeExampleComponent {

  @Input()
  public set moduleDependencies(value: SkyDocsCodeExampleModuleDependencies) {
    this._moduleDependencies = value;
  }

  public get moduleDependencies(): SkyDocsCodeExampleModuleDependencies {
    return this._moduleDependencies || {};
  }

  @Input()
  public sourceCodeLocation: string;

  @Input()
  public title: string;

  private _moduleDependencies: SkyDocsCodeExampleModuleDependencies;

}
