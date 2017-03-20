import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stache-menu',
  templateUrl: './menu.component.html'
})
export class StacheMenuComponent {
  @Input()
  public routes: any[];

  public constructor(private router: Router) {}

  public isActive(route: any): boolean {
    let path = route.path.join('/');
    if (this.router.url.includes('#')) {
      return (this.router.url === `${path}#${route.fragment}`);
    } else {
      return this.router.url === path;
    }
  }
}
