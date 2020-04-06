import {
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyModalInstance,
  SkyModalService
} from '@skyux/modals';

import {
  SkyOverlayService
} from '../overlay.service';

import {
  OverlayEntryFixtureComponent
} from './overlay-entry.component.fixture';

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
    public overlayService: SkyOverlayService,
    private modalService: SkyModalService
  ) { }

  public createModal(): SkyModalInstance {
    return this.modalService.open(OverlayEntryFixtureComponent);
  }

}
