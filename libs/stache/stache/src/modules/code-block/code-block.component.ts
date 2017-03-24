import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';

declare let Prism: any;
import 'prismjs/prism';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'stache-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss']
})
export class StacheCodeBlockComponent implements AfterViewInit {
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
