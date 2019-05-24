import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList
} from '@angular/core';

import {
  SkyDocsSourceCodeProvider
} from '../source-code/source-code-provider';

import {
  SkyDocsCodeExamplesEditorService
} from './code-examples-editor.service';

import {
  SkyDocsCodeExampleComponent
} from './code-example.component';

import {
  SkyDocsCodeExample
} from './code-example';

@Component({
  selector: 'sky-docs-code-examples',
  templateUrl: './code-examples.component.html',
  styleUrls: ['./code-examples.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCodeExamplesComponent implements AfterContentInit {

  public codeExamples: SkyDocsCodeExample[] = [];

  @ContentChildren(SkyDocsCodeExampleComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExampleComponent>;

  constructor(
    private editorService: SkyDocsCodeExamplesEditorService,
    private sourceCodeProvider: SkyDocsSourceCodeProvider
  ) { }

  public ngAfterContentInit(): void {
    this.codeExampleComponents.forEach((component) => {
      const sourceCode = this.sourceCodeProvider.getSourceCode(component.sourceCodeLocation);

      if (!sourceCode.length) {
        throw `No source code found at location "${component.sourceCodeLocation}" for "${component.title}"!`;
      }

      this.codeExamples.push({
        title: component.title,
        sourceCode,
        moduleDependencies: component.moduleDependencies
      });
    });
  }

  public launchEditor(codeExample: SkyDocsCodeExample): void {
    this.editorService.launchEditor(codeExample);
  }

  /**
   * Returns a string representing one of PrismJS's supported language types.
   * See: https://prismjs.com/#supported-languages
   * @param fileName
   */
  public parseCodeLanguageType(fileName: string): string {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'ts':
        return 'typescript';
      case 'html':
        return 'markup';
      default:
        return extension;
    }
  }
}
