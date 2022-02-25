import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-smart-link-fixture',
  templateUrl: 'href-fixture.component.html',
})
export class HrefDirectiveFixtureComponent {
  @Input()
  public dynamicLink: string | any[] = '1bb-nav://simple-app/';

  @Input()
  public dynamicElse = 'hide';
}
