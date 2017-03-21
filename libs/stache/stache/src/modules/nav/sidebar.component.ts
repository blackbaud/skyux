import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-sidebar',
  template: `
    <stache-nav navType="sidebar" [routes]="routes"></stache-nav>
  `
})
export class StacheSidebarComponent {
  @Input()
  public routes;
}
