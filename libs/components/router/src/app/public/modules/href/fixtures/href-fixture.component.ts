import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-smart-link-fixture',
  templateUrl: 'href-fixture.component.html'
})
export class HrefDirectiveFixtureComponent {
  @Input()
  public dynamicLink = '1bb-nav://simple-app/';

  @Input()
  public dynamicElse = 'hide';
}
