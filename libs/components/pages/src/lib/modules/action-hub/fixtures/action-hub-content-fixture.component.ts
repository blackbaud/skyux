import { Component } from '@angular/core';

@Component({
  selector: 'sky-action-hub-content-fixture',
  templateUrl: 'action-hub-content-fixture.component.html',
  standalone: false,
})
export class ActionHubContentFixtureComponent {
  public title = 'Page title';
  public label = 'world';
  public value = 'hello';
}
