import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';

import { SkyDocsSourceCodeService } from '../source-code/source-code.service';

import { SkyDocsCodeExample } from './code-example';
import { SkyDocsCodeExampleModuleDependencies } from './code-example-module-dependencies';
import { SkyDocsCodeExampleComponent } from './code-example.component';
import { SkyDocsCodeExamplesEditorService } from './code-examples-editor.service';

/**
 * Wraps all code examples and handles their configuration and styles.
 * @example
 * ```
 * <sky-docs-code-examples
 *   [packageDependencies]="{
 *     "foobar": "*",
 *     "baz": "1.2.3"
 *   }"
 * >
 *   <sky-docs-code-example>
 *   </sky-docs-code-example>
 * </sky-docs-code-examples>
 * ```
 */
@Component({
  selector: 'sky-docs-code-examples',
  templateUrl: './code-examples.component.html',
  styleUrls: ['./code-examples.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsCodeExamplesComponent implements AfterContentInit {
  /**
   * Any extra NPM package dependencies that are needed for the editor to run the code example.
   * @default {}
   */
  @Input()
  public set packageDependencies(value: SkyDocsCodeExampleModuleDependencies) {
    this._packageDependencies = value;
  }

  public get packageDependencies(): SkyDocsCodeExampleModuleDependencies {
    return this._packageDependencies || {};
  }

  @Input()
  public stylesheets: string[] = [];

  public codeExamples: SkyDocsCodeExample[] = [];

  @ContentChildren(SkyDocsCodeExampleComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExampleComponent>;

  private _packageDependencies: SkyDocsCodeExampleModuleDependencies;

  constructor(
    private editorService: SkyDocsCodeExamplesEditorService,
    private sourceCodeService: SkyDocsSourceCodeService
  ) {}

  public ngAfterContentInit(): void {
    this.codeExampleComponents.forEach((component) => {
      // Make sure the source code path ends in a slash, so that similarly named directories aren't included.
      let sourceCodePath = component.sourceCodePath;
      if (sourceCodePath.slice(-1) !== '/') {
        sourceCodePath += '/';
      }

      const sourceCode = this.sourceCodeService.getSourceCode(sourceCodePath);

      if (!sourceCode.length) {
        console.warn(
          `Source code not found at location "${sourceCodePath}" for "${component.heading}"!`
        );
        return;
      }

      this.codeExamples.push({
        heading: component.heading,
        packageDependencies: this.packageDependencies,
        sourceCode,
        stylesheets: this.stylesheets,
        theme: component.theme,
      });
    });
  }

  public launchEditor(codeExample: SkyDocsCodeExample): void {
    this.editorService.launchEditor(codeExample);
  }

  /**
   * Returns a string representing one of PrismJS's supported language types.
   * See: https://prismjs.com/#supported-languages
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
