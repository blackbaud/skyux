import { Component } from '@angular/core';
import { SkyActionButtonModule, SkyActionButtonPermalink } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyActionButtonModule],
})
export class DemoComponent {
  protected routerlink: SkyActionButtonPermalink = {
    route: {
      commands: [],
      extras: {
        queryParams: {
          component: 'MyComponent',
        },
      },
    },
  };

  protected url: SkyActionButtonPermalink = {
    url: 'https://www.stackblitz.com',
  };
}
