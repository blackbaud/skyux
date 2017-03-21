import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare let Prism: any;
import 'prismjs/prism';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'stache-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class StacheCodeComponent implements AfterViewInit {
  @Input() public code: string;
  public safeCode: SafeHtml;
  @Input() public languageType: string = 'markup';

  @ViewChild('code') public codeTemplateRef;

  public output: SafeHtml;

  public constructor(private sanitized: DomSanitizer) {}

  public ngAfterViewInit(): void {
    let html;

    if (this.code) {
      html = this.code;
    } else {
      html = this.codeTemplateRef.nativeElement.innerHTML;
    }

    this.output = this.sanitized.bypassSecurityTrustHtml(
      Prism.highlight(html, Prism.languages[this.languageType])
    );
  }

  public getClassNames(): string {
    return `language-${this.languageType}`;
  }
}
