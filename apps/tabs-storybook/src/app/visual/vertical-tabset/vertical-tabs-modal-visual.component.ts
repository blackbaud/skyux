import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-vertical-tabset-modal-visual',
  templateUrl: './vertical-tabs-modal-visual.component.html',
})
export class VerticalTabsetModalVisualComponent {
  public maintainTabContent = false;

  constructor(public instance: SkyModalInstance) {}
}
