import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-menu',
  template: `
    <stache-nav navType="menu" [routes]="routes"></stache-nav>
  `
})
export class StacheMenuComponent {
  @Input()
  public routes;
}
