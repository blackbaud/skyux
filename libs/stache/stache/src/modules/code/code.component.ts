import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';

declare let Prism: any;
import 'prismjs/prism';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'stache-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class StacheCodeComponent implements AfterViewInit {
  @ViewChild('code')
  public codeTemplateRef;

  @Input()
  public code: string;

  @Input()
  public language: string = 'markup';

  public output: string;

  public ngAfterViewInit(): void {
    let html;

    if (this.code) {
      html = this.code;
    } else {
      html = this.codeTemplateRef.nativeElement.innerHTML;
    }

    this.output = Prism.highlight(html, Prism.languages[this.language]);
  }

  public getClassNames(): string {
    return `language-${this.language}`;
  }
}
