import { Component, OnInit } from '@angular/core';

import { SkyModalService } from '../../public';

@Component({
  selector: 'sky-test-cmp-modal-large',
  templateUrl: './modal-large-demo.component.html',
  providers: [SkyModalService]
})
export class ModalLargeDemoComponent implements OnInit {
  public title = 'Hello world';

  public ngOnInit() {
    console.log('init happened');
  }
}
