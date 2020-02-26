import {
  Component,
  Optional,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  OverlayFixtureContext
} from './overlay-context.fixture';

@Component({
  selector: 'overlay-fixture',
  templateUrl: './overlay.component.fixture.html'
})
export class OverlayFixtureComponent {

  @ViewChild('myTemplate', {
    read: TemplateRef
  })
  public myTemplate: TemplateRef<any>;

  constructor(
    @Optional() public readonly context: OverlayFixtureContext
  ) { }

}
