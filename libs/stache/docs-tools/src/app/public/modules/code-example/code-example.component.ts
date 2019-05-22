import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyDocsCodeExample
} from './code-example';

import {
  SkyDocsCodeExampleEditorService
} from './code-example-editor.service';

import {
  SkyDocsCodeExamplesProvider
} from './code-examples-provider';

@Component({
  selector: 'sky-docs-code-example',
  templateUrl: './code-example.component.html',
  styleUrls: ['./code-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCodeExampleComponent implements OnInit {

  public get codeExamples(): SkyDocsCodeExample[] {
    return this._codeExamples;
  }

  private _codeExamples: SkyDocsCodeExample[];

  constructor(
    private editorService: SkyDocsCodeExampleEditorService,
    private examplesProvider: SkyDocsCodeExamplesProvider
  ) { }

  public ngOnInit(): void {
    this._codeExamples = this.examplesProvider.getCodeExamples();
  }

  public launchEditor(codeExample: SkyDocsCodeExample): void {
    console.log('Launching...', codeExample);
    this.editorService.launchEditor(
      {}
    );
  }

  /**
   * Returns a string representing one of PrismJS's supported language types.
   * See: https://prismjs.com/#supported-languages
   * @param fileName
   */
  public parseCodeLanguageType(fileName: string): string {
    const extension = fileName.split('.').pop().toLowerCase();

    if (extension === 'html') {
      return 'markup';
    }

    return extension;
  }

}
