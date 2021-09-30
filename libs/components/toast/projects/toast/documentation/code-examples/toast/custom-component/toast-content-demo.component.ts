import {
  Component
} from '@angular/core';

import {
  SkyToastInstance
} from '@skyux/toast';

import {
  ToastContentDemoContext
} from './toast-content-demo-context';

@Component({
  selector: 'app-toast-content-demo',
  templateUrl: './toast-content-demo.component.html'
})
export class ToastContentDemoComponent {

  constructor(
    public context: ToastContentDemoContext,
    private instance: SkyToastInstance
  ) { }

  public close(): void {
    this.instance.close();
  }

}
