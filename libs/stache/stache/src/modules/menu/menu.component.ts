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
    return (this.router.url === `${route.path.join('/')}#${route.fragment}`);
  }
}
