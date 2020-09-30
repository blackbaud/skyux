import {
  Component
} from '@angular/core';

import {
  SkyActionButtonPermalink
} from '@skyux/layout';

@Component({
  selector: 'app-action-button-demo',
  templateUrl: './action-button-demo.component.html'
})
export class ActionButtonDemoComponent {

  public routerlink: SkyActionButtonPermalink = {
    route: {
      commands: [],
      extras: {
        queryParams: {
          component: 'MyComponent'
        }
      }
    }
  };

  public url: SkyActionButtonPermalink = {
    url: 'https://developer.blackbaud.com/skyux/components'
  };
}
