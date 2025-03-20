import { Component } from '@angular/core';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyActionHubModule } from '@skyux/pages';
import { provideHrefTesting } from '@skyux/router/testing';

@Component({
  selector: 'sky-action-hub-content-fixture',
  templateUrl: 'action-hub-content-fixture.component.html',
  imports: [SkyActionHubModule, SkyKeyInfoModule],
  providers: [provideHrefTesting({ userHasAccess: true })],
})
export class ActionHubContentFixtureComponent {
  public title = 'Page title';
  public label = 'world';
  public value = 'hello';
}
