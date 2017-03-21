import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StacheNavLink } from '../nav-link';

@Component({
  selector: 'stache-nav',
  templateUrl: './nav.component.html'
})
export class StacheNavComponent implements OnInit {
  @Input() public routes: StacheNavLink[];
  @Input() public navType: string;

  public classname: string = '';

  public constructor(private router: Router) {}

  public isActive(route: any): boolean {
    let path = route.path.join('/');
    if (this.router.url.includes('#')) {
      return (this.router.url === `${path}#${route.fragment}`);
    } else {
      return this.router.url === path;
    }
  }

  public ngOnInit(): void {
    if (this.navType) {
      this.classname = `stache-nav-${this.navType}`;
    }
  }
}
