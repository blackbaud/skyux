import { Component, OnInit, Input } from '@angular/core';

import { StacheDemoComponentService } from './demo-component.service';
import { StacheDemoComponent } from './demo-component';
import { StacheNavLink } from '../../modules/nav/nav-link';

@Component({
  selector: 'stache-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class StacheDemoPageComponent implements OnInit {
  @Input() public name: string;

  public routes: StacheNavLink[] = [{
    name: 'Overview',
    path: '/components'
  }];
  public component: StacheDemoComponent;
  public demoFiles: any;

  public constructor(private componentService: StacheDemoComponentService) {}

  public ngOnInit(): void {
    this.component = this.componentService.getByName(this.name);
    this.demoFiles = this.component.getCodeFiles();

    let components = this.componentService.getAll();
    components.forEach((component) => {
      this.routes.push({
        path: [component.route],
        name: component.name
      });
    });
  }
}
