import { Component, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare let Prism: any;
import 'prismjs/prism';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import 'prismjs/components/prism-aspnet';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-fsharp';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';

@Component({
  selector: 'stache-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss']
})
export class StacheCodeBlockComponent implements AfterViewInit {
  @Input()
  public code: string;

  @Input()
  public set languageType(value: string) {
    if (this.validLanguages.indexOf(value) > -1) {
      this._languageType = value;
    } else {
      this._languageType = this.defaultLanguage;
    }
  }
  public get languageType(): string {
    return this._languageType;
  }

  @ViewChild('codeFromContent')
  public codeTemplateRef: any;

  public output: SafeHtml;
  private readonly defaultLanguage: string = 'markup';
  private validLanguages: string[];
  private _languageType: string = this.defaultLanguage;

  public constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer) {
      this.validLanguages = Object.keys(Prism.languages);
    }

  public ngAfterViewInit(): void {
    let code = '';

    if (this.code) {
      code = this.code;
    } else {
      code = this.codeTemplateRef.nativeElement.textContent;
    }

    code = this.formatCode(code);
    code = this.highlightCode(code);
    this.output = this.sanitizer.bypassSecurityTrustHtml(code);
    this.cdRef.detectChanges();
  }

  public getClassName(): string {
    return `language-${this.languageType}`;
  }

  private formatCode(code: string): string {
    return Prism.plugins.NormalizeWhitespace.normalize(code, {
      'remove-trailing': true,
      'remove-indent': true,
      'left-trim': true,
      'right-trim': true,
      'indent': 0,
      'remove-initial-line-feed': true,
      'tabs-to-spaces': 2
    });
  }

  private highlightCode(code: string): string {
    return Prism.highlight(code, Prism.languages[this.languageType]);
  }
}
