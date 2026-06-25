import { Component, TemplateRef, ViewChild, inject } from '@angular/core';

import { SkyOverlayService } from '../overlay.service';

@Component({
  selector: 'sky-overlay-test',
  templateUrl: './overlay.component.fixture.html',
  standalone: false,
})
export class OverlayFixtureComponent {
  public readonly overlayService = inject(SkyOverlayService);

  @ViewChild('myTemplate', {
    read: TemplateRef,
    static: true,
  })
  public myTemplate!: TemplateRef<unknown>;
}
