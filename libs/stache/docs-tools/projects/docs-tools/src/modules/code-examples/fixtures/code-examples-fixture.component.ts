import { Component, ViewChild } from '@angular/core';

import { SkyDocsCodeExampleModuleDependencies } from '../code-example-module-dependencies';
import { SkyDocsCodeExamplesComponent } from '../code-examples.component';

@Component({
  selector: 'sky-code-examples-fixture',
  template: `
    <sky-docs-code-examples
      [packageDependencies]='packageDependencies'
      [stylesheets]='stylesheets'
    >
      <sky-docs-code-example
        heading="Basic"
        sourceCodePath="src/app/public/plugin-resources/foobar"
      ></sky-docs-code-example>
      <sky-docs-code-example
        heading="Advanced"
        sourceCodePath="src/app/public/plugin-resources/invalid/"
      ></sky-docs-code-example>
    </sky-docs-code-examples>
  `
})
export class CodeExamplesFixtureComponent {
  @ViewChild(SkyDocsCodeExamplesComponent)
  public codeExamplesComponent: SkyDocsCodeExamplesComponent;

  public packageDependencies: SkyDocsCodeExampleModuleDependencies;

  public stylesheets: string[];
}
