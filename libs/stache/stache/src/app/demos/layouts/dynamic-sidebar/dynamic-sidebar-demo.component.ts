import {
  Component
} from '@angular/core';

import {
  StacheNavLink
} from '../../../public';

@Component({
  selector: 'app-dynamic-sidebar-demo',
  templateUrl: './dynamic-sidebar-demo.component.html'
})
export class DynamicSidebarDemoComponent {

  // NOTE: To avoid the sidebar "flashing" the default navlinks,
  // you must provide an array with at least one item.
  public sidebarRoutes: StacheNavLink[] = [
    {
      name: 'Parent link',
      path: '/parent-1',
      children: []
    }
  ];

  constructor() {

    // Simulate async call.
    setTimeout(() => {

      const sidebarRoutes = this.sidebarRoutes;
      sidebarRoutes[0].children = [
        {
          name: 'Nav link 1',
          path: '/nav-1'
        },
        {
          name: 'Nav link 1',
          path: '/nav-2'
        },
        {
          name: 'Active link',
          path: '/demos/layouts/dynamic-sidebar'
        }
      ];

      // Clone the array to trigger change detection.
      this.sidebarRoutes = JSON.parse(JSON.stringify(sidebarRoutes));

    }, 2000);
  }

}
