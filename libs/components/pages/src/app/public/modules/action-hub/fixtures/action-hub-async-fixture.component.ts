import { Component } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyActionHubData } from '../types/action-hub-data';

@Component({
  selector: 'app-action-hub-async-fixture',
  templateUrl: 'action-hub-async-fixture.component.html'
})
export class ActionHubAsyncFixtureComponent {
  public data = new Subject<SkyActionHubData>();
}
