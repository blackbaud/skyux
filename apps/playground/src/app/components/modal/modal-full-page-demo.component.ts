import { Component } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';

import { DataManagerModule } from '../../shared/data-manager/data-manager.module';
import { LipsumComponent } from '../../shared/lipsum/lipsum.component';

@Component({
  selector: 'app-test-cmp-modal-full-page',
  templateUrl: './modal-full-page-demo.component.html',
  imports: [DataManagerModule, LipsumComponent, SkyModalModule],
})
export class ModalFullPageDemoComponent {
  public showHelp = false;
  public title = 'Hello world';
}
