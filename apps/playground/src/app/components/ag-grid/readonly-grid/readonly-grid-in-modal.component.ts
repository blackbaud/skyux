import { Component, OnInit } from '@angular/core';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { ReadonlyGridComponent } from './readonly-grid.component';

@Component({
  selector: 'app-readonly-grid-in-modal-modal',
  templateUrl: './readonly-grid-in-modal.component.html',
  imports: [SkyModalModule],
})
export class ReadonlyGridInModalModalComponent {
  constructor(
    public modal: SkyModalInstance,
    private modalService: SkyModalService,
  ) {}

  public openGridModal(): void {
    this.modalService.open(ReadonlyGridInModalModalGridComponent, {
      size: 'large',
    });
  }

  public openNotGridModal(): void {
    this.modalService.open(ReadonlyGridInModalModalNotGridComponent, {
      size: 'large',
    });
  }
}

@Component({
  template: `
    <app-readonly-grid-in-modal-modal>
      <app-readonly-grid-visual />
    </app-readonly-grid-in-modal-modal>
  `,
  imports: [ReadonlyGridComponent, ReadonlyGridInModalModalComponent],
})
export class ReadonlyGridInModalModalGridComponent {}

@Component({
  template: `
    <app-readonly-grid-in-modal-modal>
      <p>Not a grid.</p>
    </app-readonly-grid-in-modal-modal>
  `,
  imports: [ReadonlyGridInModalModalComponent],
})
export class ReadonlyGridInModalModalNotGridComponent {}

@Component({
  standalone: true,
  selector: 'app-readonly-grid-in-modal',
  template: '',
})
export class ReadonlyGridInModalComponent implements OnInit {
  constructor(private modalService: SkyModalService) {}

  public ngOnInit(): void {
    this.modalService.open(ReadonlyGridInModalModalGridComponent, {
      size: 'large',
    });
  }
}
