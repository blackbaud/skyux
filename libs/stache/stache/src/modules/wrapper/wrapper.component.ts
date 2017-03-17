import { Component,
         OnInit,
         Input,
         ContentChildren,
         AfterContentInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { StachePageAnchorComponent } from '../page-anchor/page-anchor.component';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html'
})
export class StacheWrapperComponent implements OnInit, AfterContentInit {
  @Input()
  public layout: string = 'default';

  @Input()
  public pageTitle: string;

  @Input()
  public documentTitle: string = 'Browser Title';

  public routes: any[] = [];

  @ContentChildren(StachePageAnchorComponent, { descendants: true })
  private headings;

  public constructor(private titleService: Title) {}

  public ngOnInit(): void {
    this.titleService.setTitle(this.documentTitle);
  }

  public ngAfterContentInit(): void {
    this.headings.forEach(h => {
      this.routes.push({
        path: h.path,
        fragment: h.anchor,
        label: h.label
      });
    });
  }
}
