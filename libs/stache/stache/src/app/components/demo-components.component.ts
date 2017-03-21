import { Component, OnInit } from '@angular/core';

import { StacheDemoComponentService } from './demo-component.service';

@Component({
  selector: 'stache-demo-components',
  templateUrl: './demo-components.component.html'
})
export class StacheDemoComponentsComponent implements OnInit {
  public components;
  public routes = [{
    label: 'Overview',
    path: ['/components']
  }];

  public constructor(private componentService: StacheDemoComponentService) { }

  public ngOnInit(): void {
    this.components = this.componentService.getAll();
    this.components.forEach((component) => {
      this.routes.push({
        path: [component.route],
        label: component.name
      });
    });
  }
}
