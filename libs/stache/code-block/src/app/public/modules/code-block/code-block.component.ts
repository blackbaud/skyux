import { Component, Input, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare let Prism: any;
import 'prismjs/prism';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import * as PrismLanguages from './prism-languages';

@Component({
  selector: 'sky-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss']
})
export class SkyCodeBlockComponent implements AfterViewInit, OnInit {
  @Input()
  public code: string;

  @Input()
  public set languageType(value: string) {
    this.setDisplayName(value);
    if (this.validLanguages.indexOf(value) > -1) {
      this._languageType = value;
    } else {
      this._languageType = this.defaultLanguage;
    }
  }

  @Input()
  public hideCopyToClipboard: boolean = false;

  @Input()
  public hideHeader: boolean;

  public get languageType(): string {
    return this._languageType;
  }

  @ViewChild('codeFromContent')
  public codeTemplateRef: any;

  public output: SafeHtml;
  public displayName: string;
  private readonly defaultLanguage: string = 'markup';
  private validLanguages: string[];
  private prismLanguages: any;
  private _languageType: string = this.defaultLanguage;

  public constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer) {
      this.validLanguages = Object.keys(Prism.languages);
      this.prismLanguages = PrismLanguages.languages;
    }
  public ngOnInit(): void {
    this.hideHeader = this.hideHeader || (!this.displayName && this.hideCopyToClipboard);
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

  private setDisplayName(value: string = '') {
    this.displayName = this.prismLanguages[value];
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
