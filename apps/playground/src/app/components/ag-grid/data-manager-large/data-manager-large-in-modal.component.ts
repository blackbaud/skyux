import { Component, OnInit } from '@angular/core';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { DataManagerLargeComponent } from './data-manager-large.component';

@Component({
  selector: 'app-data-manager-large-in-modal-modal',
  templateUrl: './data-manager-large-in-modal.component.html',
  imports: [SkyModalModule],
})
export class DataManagerLargeInModalModalComponent {
  constructor(
    public modal: SkyModalInstance,
    private modalService: SkyModalService,
  ) {}

  public openGridModal(): void {
    this.modalService.open(DataManagerLargeInModalModalGridComponent, {
      size: 'large',
    });
  }

  public openNotGridModal(): void {
    this.modalService.open(DataManagerLargeInModalModalNotGridComponent, {
      size: 'large',
    });
  }
}

@Component({
  selector: 'app-data-manager-large-in-modal-modal-grid',
  template: `
    <app-data-manager-large-in-modal-modal>
      <app-data-manager-large />
    </app-data-manager-large-in-modal-modal>
  `,
  imports: [DataManagerLargeComponent, DataManagerLargeInModalModalComponent],
})
export class DataManagerLargeInModalModalGridComponent {}

@Component({
  selector: 'app-data-manager-large-in-modal-modal-not-grid',
  template: `
    <app-data-manager-large-in-modal-modal>
      <p>Not a grid.</p>
    </app-data-manager-large-in-modal-modal>
  `,
  imports: [DataManagerLargeInModalModalComponent],
})
export class DataManagerLargeInModalModalNotGridComponent {}

@Component({
  selector: 'app-data-manager-large-in-modal',
  template: '',
})
export class DataManagerLargeInModalComponent implements OnInit {
  constructor(private modalService: SkyModalService) {}

  public ngOnInit(): void {
    this.modalService.open(DataManagerLargeInModalModalGridComponent, {
      size: 'large',
    });
  }
}
