import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SampleModalDemoContext
} from './sample-modal-demo-context';

@Component({
  selector: 'app-sample-modal-demo',
  templateUrl: './sample-modal-demo.component.html',
  styleUrls: ['./sample-modal-demo.component.scss']
})
export class SampleModalDemoComponent {

  constructor(
    public context: SampleModalDemoContext,
    private instance: SkyModalInstance
  ) { }

  public onCloseButtonClick(): void {
    this.instance.save('Something cool');
  }

}
