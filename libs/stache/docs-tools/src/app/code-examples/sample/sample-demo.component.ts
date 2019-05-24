import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SampleModalDemoContext
} from './sample-modal-demo-context';

import {
  SampleModalDemoComponent
} from './sample-modal-demo.component';

@Component({
  selector: 'app-sample-demo',
  templateUrl: './sample-demo.component.html',
  styleUrls: ['./sample-demo.component.scss']
})
export class SampleDemoComponent {
  public heading = 'Hello!';

  constructor(
    private modalService: SkyModalService
  ) { }

  public openModal(): void {
    this.modalService.open(SampleModalDemoComponent, {
      providers: [
        {
          provide: SampleModalDemoContext,
          useValue: new SampleModalDemoContext('Custom heading')
        }
      ]
    });
  }
}
