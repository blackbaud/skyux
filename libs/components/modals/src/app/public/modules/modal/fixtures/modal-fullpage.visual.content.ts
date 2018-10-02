import { Component, OnInit } from '@angular/core';

import { SkyModalService } from '../modal.service';

@Component({
  selector: 'sky-test-cmp-modal-fullpage',
  templateUrl: './modal-fullpage.visual.content.html',
  providers: [SkyModalService]
})
export class ModalFullPageDemoComponent implements OnInit {
  public title = 'Hello world';

  public ngOnInit() {
    console.log('init happened');
  }
}
