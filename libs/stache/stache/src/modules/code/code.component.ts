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
  @Input()
  public code: string;

  @Input()
  public languageType: string = 'markup';

  @ViewChild('codeFromContent')
  public codeTemplateRef: any;

  public output: string;

  public ngAfterViewInit(): void {
    let html = '';

    if (this.code) {
      html = this.code;
    } else {
      html = this.codeTemplateRef.nativeElement.innerHTML;
    }

    this.output = Prism.highlight(html, Prism.languages[this.languageType]);
  }

  public getClassNames(): string {
    return `language-${this.languageType}`;
  }
}
