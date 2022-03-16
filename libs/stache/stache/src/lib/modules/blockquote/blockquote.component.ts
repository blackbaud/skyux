import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stache-blockquote',
  templateUrl: './blockquote.component.html',
  styleUrls: ['./blockquote.component.scss'],
})
export class StacheBlockquoteComponent implements OnInit {
  @Input()
  public author: string;

  @Input()
  public quoteSource: string;

  public ngOnInit(): void {
    if (this.hasQuoteSource() && !this.hasAuthor()) {
      this.author = 'Source';
    }
  }

  public hasAuthor(): boolean {
    return this.author !== undefined;
  }

  public hasQuoteSource(): boolean {
    return this.quoteSource !== undefined;
  }
}
