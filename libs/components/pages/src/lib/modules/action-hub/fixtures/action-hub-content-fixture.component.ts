import { Component } from '@angular/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { SkyActionHubModule } from '../action-hub.module';

@Component({
  selector: 'sky-action-hub-content-fixture',
  templateUrl: 'action-hub-content-fixture.component.html',
  imports: [SkyActionHubModule, SkyKeyInfoModule],
})
export class ActionHubContentFixtureComponent {
  public title = 'Page title';
  public label = 'world';
  public value = 'hello';
}
