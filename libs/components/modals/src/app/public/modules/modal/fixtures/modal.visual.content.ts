import { Component, OnInit } from '@angular/core';

import { SkyModalService } from '../modal.service';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './modal.visual.content.html',
  providers: [SkyModalService]
})
export class ModalDemoComponent implements OnInit {
  public title = 'Hello world';

  public ngOnInit() {
    console.log('init happened');
  }
}
