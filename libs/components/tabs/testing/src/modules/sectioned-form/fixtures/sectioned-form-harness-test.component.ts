import { Component, input } from '@angular/core';
import {
  SkySectionedFormMessage,
  SkySectionedFormMessageType,
  SkySectionedFormModule,
} from '@skyux/tabs';

import { Subject } from 'rxjs';

@Component({
  selector: 'sky-sectioned-form-fixture',
  templateUrl: './sectioned-form-harness-test.component.html',
  imports: [SkySectionedFormModule],
})
export class SectionedFormHarnessTestComponent {
  public activeIndexDisplay: number | undefined;
  public activeTab = input<boolean>(true);

  protected controller = new Subject<SkySectionedFormMessage>();

  public onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
  }

  public showTabs(): void {
    this.controller.next({ type: SkySectionedFormMessageType.ShowTabs });
  }
}
