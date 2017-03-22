import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-page-contents',
  template: `
    <div class="stache-page-contents">
      <h4 class="stache-page-contents-heading">Contents</h4>
      <stache-nav navType="page-contents" [routes]="routes"></stache-nav>
    </div>
  `
})
export class StachePageContentsComponent {
  @Input()
  public routes;
}
