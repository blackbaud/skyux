import { Component, OnInit } from '@angular/core';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { EditComplexCellsComponent } from './edit-complex-cells.component';

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal',
  templateUrl: './edit-complex-cells-in-modal.component.html',
  imports: [SkyModalModule],
})
export class EditComplexCellsInModalModalComponent {
  constructor(
    public modal: SkyModalInstance,
    private modalService: SkyModalService,
  ) {}

  public openGridModal(): void {
    this.modalService.open(EditComplexCellsInModalModalGridComponent, {
      size: 'large',
    });
  }

  public openNotGridModal(): void {
    this.modalService.open(EditComplexCellsInModalModalNotGridComponent, {
      size: 'large',
    });
  }
}

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal-grid',
  template: `
    <app-edit-complex-cells-in-modal-modal>
      <app-edit-complex-cells-visual />
    </app-edit-complex-cells-in-modal-modal>
  `,
  imports: [EditComplexCellsComponent, EditComplexCellsInModalModalComponent],
})
export class EditComplexCellsInModalModalGridComponent {}

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal-not-grid',
  template: `
    <app-edit-complex-cells-in-modal-modal>
      <p>Not a grid.</p>
    </app-edit-complex-cells-in-modal-modal>
  `,
  imports: [EditComplexCellsInModalModalComponent],
})
export class EditComplexCellsInModalModalNotGridComponent {}

@Component({
  selector: 'app-edit-complex-cells-in-modal',
  template: '',
})
export class EditComplexCellsInModalComponent implements OnInit {
  constructor(private modalService: SkyModalService) {}

  public ngOnInit(): void {
    this.modalService.open(EditComplexCellsInModalModalGridComponent, {
      size: 'large',
    });
  }
}
