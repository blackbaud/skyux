import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-table-of-contents',
  template: `
    <div class="stache-table-of-contents">
      <h4 class="stache-table-of-contents-heading">Contents</h4>
      <stache-nav navType="table-of-contents" [routes]="routes"></stache-nav>
    </div>
  `
})
export class StacheTableOfContentsComponent {
  @Input()
  public routes;
}
