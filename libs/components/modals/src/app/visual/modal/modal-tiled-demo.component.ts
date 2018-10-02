import { Component, OnInit } from '@angular/core';

import { SkyModalService } from '../../public';

@Component({
  selector: 'sky-test-cmp-modal-tiled',
  templateUrl: './modal-tiled-demo.component.html',
  providers: [SkyModalService]
})
export class ModalTiledDemoComponent implements OnInit {
  public title = 'Hello world';

  public ngOnInit() {
    console.log('init happened');
  }
}
