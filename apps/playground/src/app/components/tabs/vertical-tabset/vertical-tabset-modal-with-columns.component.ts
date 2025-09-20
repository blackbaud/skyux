import { Component } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyModalModule } from '@skyux/modals';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

@Component({
  selector: 'app-vertical-tabset-modal-with-columns',
  templateUrl: './vertical-tabset-modal-with-columns.component.html',
  styleUrls: ['./vertical-tabset-modal-with-columns.component.scss'],
  imports: [SkyFluidGridModule, SkyModalModule, SkyVerticalTabsetModule],
})
export class VerticalTabsetModalWithColumnsComponent {
  constructor() {}
}
