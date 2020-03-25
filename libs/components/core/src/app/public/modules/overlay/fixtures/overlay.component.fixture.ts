import {
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyOverlayService
} from '../overlay.service';

@Component({
  selector: 'app-overlay-test',
  templateUrl: './overlay.component.fixture.html'
})
export class OverlayFixtureComponent {

  @ViewChild('myTemplate', {
    read: TemplateRef
  })
  public myTemplate: TemplateRef<any>;

  constructor(
    public overlayService: SkyOverlayService
  ) { }

}
