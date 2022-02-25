import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyOverlayService } from '../overlay.service';

@Component({
  selector: 'sky-overlay-test',
  templateUrl: './overlay.component.fixture.html',
})
export class OverlayFixtureComponent {
  @ViewChild('myTemplate', {
    read: TemplateRef,
    static: true,
  })
  public myTemplate: TemplateRef<any>;

  constructor(public overlayService: SkyOverlayService) {}
}
