import { Component } from '@angular/core';
import { SkyActionButtonModule, SkyActionButtonPermalink } from '@skyux/layout';

/**
 * @title Action button with permalinks
 */
@Component({
  selector: 'app-layout-action-button-permalink-example',
  templateUrl: './example.component.html',
  imports: [SkyActionButtonModule],
})
export class LayoutActionButtonPermalinkExampleComponent {
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
