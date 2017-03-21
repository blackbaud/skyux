import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-page-contents',
  template: `
    <h4>Page Contents</h4>
    <stache-nav navType="page-contents" [routes]="routes"></stache-nav>
  `
})
export class StachePageContentsComponent {
  @Input()
  public routes;
}
