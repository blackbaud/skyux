import { Component } from '@angular/core';

import { SkyActionHubData } from '../types/action-hub-data';

@Component({
  selector: 'app-action-hub-content-fixture',
  templateUrl: 'action-hub-content-fixture.component.html'
})
export class ActionHubContentFixtureComponent {
  public data: SkyActionHubData = {
    title: 'Page title'
  };
  public label = 'world';
  public value = 'hello';
}
